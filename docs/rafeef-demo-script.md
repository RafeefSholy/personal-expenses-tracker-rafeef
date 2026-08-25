# Personal Expense Tracker MCP — Demo Script

## 0:00–0:40 — Project Overview and Problem

Hello. This is our Personal Expense Tracker MCP project.

The main idea of the project is to make personal expense management simple while keeping the interaction with local data controlled and safe.

Instead of manually searching through expense records or calculating totals, the user can interact with the expense tracker through an MCP client.

The project supports the main expense-management operations: adding expenses, viewing them, calculating spending summaries, updating existing expenses, and deleting expenses.

The expense data is stored locally in `data/expenses.csv`, so the project does not depend on an external database.

---

## 0:40–1:10 — Architecture

The project follows a simple controlled flow:

MCP Client
→ Zod Validation
→ Expense Tool
→ Data Logic
→ `data/expenses.csv`

The MCP client sends a request to one of the available tools.

Before the request reaches the expense logic, the input is validated using Zod schemas.

Each tool has a specific responsibility, and the data layer reads from or safely writes to the local CSV file.

This structure keeps the project organized and prevents a tool from performing actions outside its intended purpose.

---

## 1:10–1:40 — Project Development and My Contribution

During the project, we gradually moved from defining the expense data and basic operations to exposing them as MCP tools and testing the complete flow.

One part I focused on was the spending summary functionality.

I worked on connecting `get_spending_summary` to the real expense data and calculating useful monthly information.

The summary can calculate:

- the total amount spent,
- the number of expenses,
- and spending totals grouped by category.

I also tested the spending summary through MCP Inspector to verify that the tool receives the expected input and returns the correct structured result.

This functionality makes the stored expense data more useful because the user can understand spending patterns instead of only viewing individual records.

---

## 1:40–3:30 — Live Demo

The server provides five focused expense tools:

- `add_expense`
- `list_expenses`
- `get_spending_summary`
- `update_expense`
- `delete_expense`

For the live demo, I will use two prompts.

### Live Prompt 1 — Add an Expense

Using the Personal Expense Tracker, add a $25 groceries expense for milk and bread on August 16, 2026.

Expected tool:

`add_expense`

Expected input:

{
  "amount": 25,
  "category": "groceries",
  "date": "2026-08-16",
  "description": "milk and bread"
}

This demonstrates how a new expense is validated and stored in the local expense file.

After the request succeeds, the result should contain the newly created expense.

### Live Prompt 2 — Spending Summary

Using the Personal Expense Tracker, show me my spending summary for August 2026.

Expected tool:

`get_spending_summary`

Expected input:

{
  "month": "2026-08"
}

This is the part of the project I focused on.

The tool reads the expense data for the selected month and calculates the total spending, expense count, and totals by category.

This demonstrates that the MCP server can do more than store expenses — it can also turn the expense records into useful spending information.

---

## Backup Prompt

If one of the live prompts cannot be used, I will use:

Using the Personal Expense Tracker, show me my groceries expenses for August 2026.

Expected tool:

`list_expenses`

Expected input:

{
  "month": "2026-08",
  "category": "groceries"
}

This provides a simple read-only demonstration using the local expense data.

---

## 3:30–4:30 — What We Would Build Next

The current project provides the core functionality needed for local personal expense tracking.

Possible future improvements include:

- clearer spending charts and visual reports,
- optional encrypted backups,
- a safe CSV import preview,
- and additional reporting options for understanding spending over time.

An important goal would be to keep the same controlled architecture as new features are added.

The project should continue validating input and limiting every tool to its intended action.

---

## 4:30–5:00 — Conclusion and Questions

To summarize, the Personal Expense Tracker MCP provides five focused tools for managing local expense data.

The project combines input validation, focused MCP tools, local CSV storage, and spending analysis.

My main contribution highlighted in this demo is the spending summary functionality, which turns individual expense records into monthly totals and category-based summaries.

Thank you.

I am ready for questions.

---

## Offline Backup Plan

The expense data and MCP server work locally.

Before the presentation, I will install the required dependencies, build the project, and start MCP Inspector while the connection is available.

If Wi-Fi becomes unavailable during the presentation, I can still demonstrate the project using the local expense data and the already running environment.

The preferred backup tool is:

`get_spending_summary`

with:

{
  "month": "2026-08"
}

This uses the local expense data and demonstrates the spending-summary functionality without requiring an external database.

---

(https://github.com/RafeefSholy/personal-expenses-tracker-rafeef/blob/bf06d656c171548cbc06b0fe5fc13dfb084f581c/docs/rafeef_personal_expense_tracker_demo.pdf

https://github.com/RafeefSholy/personal-expenses-tracker-rafeef/blob/bf06d656c171548cbc06b0fe5fc13dfb084f581c/docs/rafeef_personal_expense_tracker_demo.pptx)

## Demo Checklist

- Project builds successfully.
- MCP Inspector starts successfully.
- Live Prompt 1 is tested before the presentation.
- Live Prompt 2 is tested before the presentation.
- Backup prompt is ready.
- Demo stays within 3–5 minutes.
- Slides are open before starting the demo.
