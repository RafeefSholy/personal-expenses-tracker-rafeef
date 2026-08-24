import type { ExpenseRow } from "../schemas/index.js";
import { listExpensesInputSchema } from "../schemas/index.js";

export const MAX_EXPENSE_RESULTS = 10;

export type ExpenseListResult = {
  expenses: ExpenseRow[];
  count: number;
  totalMatches: number;
  truncated: boolean;
  message: string;
};

export function filterExpenses(
  expenses: ExpenseRow[],
  month?: string,
  category?: string,
): ExpenseRow[] {
  const filters = listExpensesInputSchema.parse({ month, category });

  return expenses.filter((expense) => {
    const matchesMonth =
      filters.month === undefined || expense.date.startsWith(filters.month);

    const matchesCategory =
      filters.category === undefined ||
      expense.category === filters.category;

    return matchesMonth && matchesCategory;
  });
}

export function createExpenseListResult(
  expenses: ExpenseRow[],
  month?: string,
  category?: string,
): ExpenseListResult {
  const filteredExpenses = filterExpenses(expenses, month, category);

  return {
    expenses: filteredExpenses.slice(0, MAX_EXPENSE_RESULTS),
    count: Math.min(filteredExpenses.length, MAX_EXPENSE_RESULTS),
    totalMatches: filteredExpenses.length,
    truncated: filteredExpenses.length > MAX_EXPENSE_RESULTS,
    message:
      filteredExpenses.length === 0
        ? "no matching expenses found"
        : "matching expenses found",
  };
}
