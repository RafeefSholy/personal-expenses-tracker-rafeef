import type { McpServer } from "@modelcontextprotocol/server";
import { readExpenses } from "../lib/expenses-file.js";
import { calculateSpendingSummary } from "../lib/spending-summary-data.js";

import {
  createGetSpendingSummaryInputSchema,
  getSpendingSummaryOutputSchema,
} from "../schemas/index.js";


export function registerGetSpendingSummaryTool(
  server: McpServer,
): void {
  const inputSchema = createGetSpendingSummaryInputSchema();

  server.registerTool(
    "get_spending_summary",
    {
      description: "get a spending summary",
      inputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ month }) => {
      try {
        const expenses = await readExpenses();

        const filteredExpenses =
          month === undefined
            ? expenses
            : expenses.filter((expense) =>
                expense.date.startsWith(month),
              );

        const summary =
          calculateSpendingSummary(filteredExpenses);

        const result = {
          month: month ?? "all",
          ...summary,
          message:
            filteredExpenses.length === 0
              ? "no matching expenses found"
              : "spending summary created",
        };

        const validatedResult =
          getSpendingSummaryOutputSchema.parse(result);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(validatedResult, null, 2),
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error
            ? error.message
            : "unknown error";

        console.error(
          `get_spending_summary failed: ${reason}`,
        );

        return {
          content: [
            {
              type: "text",
              text: "could not create spending summary",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
