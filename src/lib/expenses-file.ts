//the shared bridge between your tools and the real CSV data
import { randomUUID } from "node:crypto";
import { open, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

import {
  expenseRowSchema,
  type ExpenseRow,
} from "../schemas/index.js";

// Fixed, non-configurable path — no tool ever passes in a custom csvPath,
// which is what prevents path traversal here rather than validating one.
export const expensesFilePath = path.resolve(
  process.cwd(),
  "data",
  "expenses.csv",
);

const CSV_COLUMNS = [
  "id",
  "amount",
  "category",
  "date",
  "description",
] as const;
const CSV_HEADER = CSV_COLUMNS.join(",");

let expenseMutationQueue: Promise<void> = Promise.resolve();

export async function readExpenses(): Promise<ExpenseRow[]> {
  let csvText: string;

  try {
    csvText = await readFile(expensesFilePath, "utf-8");
  } catch (error) {
    // Missing file is a valid "no data yet" state, not a crash.
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const csvWithoutBom = csvText.startsWith("\uFEFF")
    ? csvText.slice(1)
    : csvText;
  const [header = ""] = csvWithoutBom.split(/\r?\n/, 1);

  if (header !== CSV_HEADER) {
    throw new Error("expense data has an invalid header");
  }

  const parsedRows: unknown[] = parse(csvText, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });

  const expenses = parsedRows.map((row) => expenseRowSchema.parse(row));
  const expenseIds = new Set<string>();

  for (const expense of expenses) {
    if (expenseIds.has(expense.id)) {
      throw new Error("expense data contains duplicate IDs");
    }

    expenseIds.add(expense.id);
  }

  return expenses;
}

export async function appendExpense(
  expense: ExpenseRow,
): Promise<void> {
  const validatedExpense = expenseRowSchema.parse(expense);

  await mutateExpenses((expenses) => ({
    expenses: [...expenses, validatedExpense],
    result: undefined,
  }));
}

export async function mutateExpenses<T>(
  mutation: (expenses: ExpenseRow[]) => {
    expenses: ExpenseRow[];
    result: T;
  },
): Promise<T> {
  return withExpenseMutationLock(async () => {
    const currentExpenses = await readExpenses();
    const mutationResult = mutation(currentExpenses);
    const validatedExpenses = mutationResult.expenses.map((expense) =>
      expenseRowSchema.parse(expense)
    );

    await replaceExpensesFile(validatedExpenses);

    return mutationResult.result;
  });
}

function withExpenseMutationLock<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const result = expenseMutationQueue.then(operation, operation);

  expenseMutationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}

async function replaceExpensesFile(
  expenses: ExpenseRow[],
): Promise<void> {
  const csvText = stringify(expenses, {
    header: true,
    columns: CSV_COLUMNS,
  });
  const temporaryFilePath = path.join(
    path.dirname(expensesFilePath),
    `.expenses.csv.${process.pid}.${randomUUID()}.tmp`,
  );
  let temporaryFile;

  try {
    temporaryFile = await open(temporaryFilePath, "wx");
    await temporaryFile.writeFile(csvText, "utf-8");
    await temporaryFile.sync();
    await temporaryFile.close();
    temporaryFile = undefined;

    await rename(temporaryFilePath, expensesFilePath);
  } catch (error) {
    if (temporaryFile !== undefined) {
      await temporaryFile.close().catch(() => undefined);
    }

    await unlink(temporaryFilePath).catch(() => undefined);
    throw error;
  }
}
