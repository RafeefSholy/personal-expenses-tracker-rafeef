import type { McpServer } from "@modelcontextprotocol/server";
import { readExpenses } from "../lib/expenses-file.js";
import { createExpenseListResult } from "../lib/list-expenses-data.js";
import { createListExpensesInputSchema } from "../schemas/index.js";

export function registerListExpensesTool(server: McpServer): void {
  const inputSchema = createListExpensesInputSchema();

  server.registerTool(
    "list_expenses",
    {
      description: "list expenses with optional filters",
      inputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ month, category }) => {
      try {
        const expenses = await readExpenses();
        const result = createExpenseListResult(expenses, month, category);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown error";
        console.error(`list_expenses failed: ${reason}`);
        return {
          content: [
            {
              type: "text",
              text: "could not list expenses",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
