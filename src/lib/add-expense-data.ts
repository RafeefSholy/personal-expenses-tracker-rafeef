import { randomUUID } from "node:crypto";

import {
  addExpenseInputSchema,
  type ExpenseRow,
} from "../schemas/index.js";

export function normalizeExpenseCategory(category: string): string {
  return category.trim().toLowerCase();
}

export function createExpense(
  amount: number,
  category: string,
  date: string,
  description?: string,
): ExpenseRow {
  const input = addExpenseInputSchema.parse({
    amount,
    category,
    date,
    description,
  });

  return {
    id: randomUUID(),
    amount: input.amount,
    category: normalizeExpenseCategory(input.category),
    date: input.date,
    description: input.description ?? "",
  };
}
