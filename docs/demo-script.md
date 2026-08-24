# Personal Expense Tracker MCP - Demo Script

## 0:00-0:40 - Problem

Hello. This is my Personal Expense Tracker MCP server.

People often keep expenses in notes or messages. This makes them difficult to find, manage, and summarize.

The Personal Expense Tracker gives an AI model five focused tools for storing and reviewing expenses.

The model can work with expense data, but it cannot choose a file, run a command, access the internet, or perform an unlimited action.

The goal is to make expense tracking simple while keeping the MCP server safe.

## 0:40-1:10 - Architecture

The project follows one clear path:

```text
MCP Client
-> Zod Validation
-> Expense Tool
-> Data Logic
-> data/expenses.csv
```

The MCP client sends a tool request.

Zod validates the input before it reaches the expense logic. Invalid dates, amounts, IDs, months, and empty values are rejected.

The selected expense tool can perform only its defined action.

The data logic reads or safely writes one fixed local file: `data/expenses.csv`.

Categories are trimmed and changed to lowercase. Dates are checked as real calendar dates. Write operations are placed in a queue to prevent file corruption.

## 1:10-3:30 - Live Demo

The server has five tools:

- `add_expense`
- `list_expenses`
- `get_spending_summary`
- `update_expense`
- `delete_expense`

Add, update, and delete can change expense data. List and summary are read-only.

I will use two normal prompts to show the main expense flow.

### Prompt 1

Using the Personal Expense Tracker, add a $25 groceries expense for milk and bread on August 16, 2026.

Expected tool:

`add_expense`

Expected input:

```json
{
  "amount": 25,
  "category": "groceries",
  "date": "2026-08-16",
  "description": "milk and bread"
}
```

The server validates the amount, category, date, and description.

It creates a unique UUID and stores the category as lowercase text.

The result should contain `success: true` and the new expense.

### Prompt 2

Using the Personal Expense Tracker, show me my groceries expenses for August 2026.

Expected tool:

`list_expenses`

Expected input:

```json
{
  "month": "2026-08",
  "category": "groceries"
}
```

The list tool uses both filters and returns the matching local expenses.

The result should include the expense added by the first prompt.

The exact count may be higher if the add prompt was used during rehearsal.

The list output is bounded, so a large CSV file cannot create an unlimited response.

### Backup Prompt

Using the Personal Expense Tracker, show how much I spent in August 2026 and which category had the highest total.

Expected tool:

`get_spending_summary`

Expected input:

```json
{
  "month": "2026-08"
}
```

The summary tool reads the local expenses and calculates the total for each category.

The exact total can change after new expenses are added.

Update and delete use the same validation and fixed storage. Update changes one matching expense ID. Delete removes one matching expense ID. Neither tool can access another file.

## 3:30-4:30 - Next Steps

The current version is local and single-user.

Possible future improvements are:

- optional encrypted backup
- clearer spending charts
- a safe CSV import preview
- keeping the local mode for privacy and offline use

Every new feature should keep the same strict validation and limited permissions.

New features should also be tested against damaged CSV data, invalid input, and repeated tool calls.

## 4:30-5:00 - Finish

The Personal Expense Tracker provides five focused expense tools with strict input validation, safe local storage, bounded output, and limited permissions.

It is useful without giving the AI client unnecessary access to files, commands, or the internet.

Thank you. I am ready for questions.

## Offline Backup

The MCP server and CSV file work locally.

Before the demo, I will run `npm install` and start MCP Inspector while Wi-Fi is available.

If Wi-Fi fails, I can keep using the open Inspector with the local `data/expenses.csv` fixture data.

The offline backup call is `get_spending_summary` with:

```json
{
  "month": "2026-08"
}
```

This reads the local fixture file and does not need a network request.

## Rehearsal

Rehearsal 1: 4:52

Rehearsal 2: 4:43

Both live tool calls worked in both rehearsals.

Both rehearsals were under five minutes.

## Slides

- [Demo slides - PDF](./demo-slides.pdf)
- [Demo slides - PowerPoint](./demo-slides.pptx)
