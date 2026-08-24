import type { McpServer } from "@modelcontextprotocol/server";

import { deleteExpense } from "../lib/delete-expense-data.js";
import { ExpenseNotFoundError } from "../lib/expense-errors.js";
import { createDeleteExpenseInputSchema } from "../schemas/index.js";

export function registerDeleteExpenseTool(server: McpServer): void {
  const inputSchema = createDeleteExpenseInputSchema();

  server.registerTool(
    "delete_expense",
    {
      description: "delete an existing expense by ID",
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async ({ id }) => {
      try {
        await deleteExpense(id);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  id,
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

        console.error(`delete_expense failed: ${reason}`);

        return {
          content: [
            {
              type: "text",
              text: isNotFound
                ? "expense not found"
                : "could not delete expense",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
