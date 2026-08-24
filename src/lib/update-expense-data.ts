import { normalizeExpenseCategory } from "./add-expense-data.js";
import { ExpenseNotFoundError } from "./expense-errors.js";
import { mutateExpenses } from "./expenses-file.js";
import {
  updateExpenseInputSchema,
  type ExpenseRow,
} from "../schemas/index.js";

type ExpenseUpdate = Partial<
  Pick<ExpenseRow, "amount" | "category" | "date" | "description">
>;

export async function updateExpense(
  id: string,
  updates: ExpenseUpdate,
): Promise<ExpenseRow> {
  const input = updateExpenseInputSchema.parse({ id, ...updates });

  return mutateExpenses((expenses) => {
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === input.id,
    );

    if (expenseIndex === -1) {
      throw new ExpenseNotFoundError();
    }

    const currentExpense = expenses[expenseIndex];
    const updatedExpense: ExpenseRow = {
      id: currentExpense.id,
      amount: input.amount ?? currentExpense.amount,
      category:
        input.category === undefined
          ? currentExpense.category
          : normalizeExpenseCategory(input.category),
      date: input.date ?? currentExpense.date,
      description:
        input.description ?? currentExpense.description,
    };
    const updatedExpenses = [...expenses];

    updatedExpenses[expenseIndex] = updatedExpense;

    return {
      expenses: updatedExpenses,
      result: updatedExpense,
    };
  });
}
