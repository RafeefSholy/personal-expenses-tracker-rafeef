import { McpServer } from "@modelcontextprotocol/server";

import { registerAddExpenseTool } from "./tools/add-expense.js";
import { registerDeleteExpenseTool } from "./tools/delete-expense.js";
import { registerGetSpendingSummaryTool } from "./tools/get-spending-summary.js";
import { registerListExpensesTool } from "./tools/list-expenses.js";
import { registerUpdateExpenseTool } from "./tools/update-expense.js";

/** Creates a fresh, independently registered server for each connection. */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "personal-expense-tracker",
    version: "0.1.0",
  });

  registerAddExpenseTool(server);
  registerUpdateExpenseTool(server);
  registerDeleteExpenseTool(server);
  registerListExpensesTool(server);
  registerGetSpendingSummaryTool(server);

  return server;
}
