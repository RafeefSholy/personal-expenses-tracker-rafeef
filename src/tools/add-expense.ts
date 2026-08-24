import type { McpServer } from "@modelcontextprotocol/server";

import { createExpense } from "../lib/add-expense-data.js";
import { appendExpense } from "../lib/expenses-file.js";
import { createAddExpenseInputSchema } from "../schemas/index.js";

export function registerAddExpenseTool(server: McpServer): void {
  const inputSchema = createAddExpenseInputSchema();

  server.registerTool(
    "add_expense",
    {
      description: "add a new expense",
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ amount, category, date, description }) => {
      try {
        const newExpense = createExpense(
          amount,
          category,
          date,
          description,
        );

        await appendExpense(newExpense);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  expense: newExpense,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error
            ? error.message
            : "unknown error";

        console.error(`add_expense failed: ${reason}`);

        return {
          content: [
            {
              type: "text",
              text: "could not add expense",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
