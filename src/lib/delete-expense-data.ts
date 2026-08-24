import { ExpenseNotFoundError } from "./expense-errors.js";
import { mutateExpenses } from "./expenses-file.js";
import { deleteExpenseInputSchema } from "../schemas/index.js";

export async function deleteExpense(id: string): Promise<void> {
  const input = deleteExpenseInputSchema.parse({ id });

  return mutateExpenses((expenses) => {
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === input.id,
    );

    if (expenseIndex === -1) {
      throw new ExpenseNotFoundError();
    }

    return {
      expenses: expenses.filter((_, index) => index !== expenseIndex),
      result: undefined,
    };
  });
}
