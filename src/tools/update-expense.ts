import type { McpServer } from "@modelcontextprotocol/server";

import { ExpenseNotFoundError } from "../lib/expense-errors.js";
import { updateExpense } from "../lib/update-expense-data.js";
import { createUpdateExpenseInputSchema } from "../schemas/index.js";

export function registerUpdateExpenseTool(server: McpServer): void {
  const inputSchema = createUpdateExpenseInputSchema();

  server.registerTool(
    "update_expense",
    {
      description: "update an existing expense by ID",
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ id, amount, category, date, description }) => {
      try {
        const expense = await updateExpense(id, {
          amount,
          category,
          date,
          description,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  expense,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const isNotFound = error instanceof ExpenseNotFoundError;
        const reason = error instanceof Error ? error.message : "unknown error";

        console.error(`update_expense failed: ${reason}`);

        return {
          content: [
            {
              type: "text",
              text: isNotFound
                ? "expense not found"
                : "could not update expense",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
