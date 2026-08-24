# Demo Conversations

Use these exact prompts during the demo. They use fixed dates, so the model does not need to guess what "today" means.

## Live prompt 1 - Add an expense

### Say or paste this

> Using the Personal Expense Tracker, add a $25 groceries expense for milk and bread on August 16, 2026.

### Expected tool call

The model should call `add_expense` once with:

```json
{
  "amount": 25,
  "category": "groceries",
  "date": "2026-08-16",
  "description": "milk and bread"
}
```

### Expected result

The tool should return `success: true`, a new UUID, and the saved expense. The category should be stored as `groceries`.

## Live prompt 2 - Find the expense

### Say or paste this

> Using the Personal Expense Tracker, show me my groceries expenses for August 2026.

### Expected tool call

The model should call `list_expenses` once with:

```json
{
  "month": "2026-08",
  "category": "groceries"
}
```

### Expected result

The result should include the expense from live prompt 1. The exact count can change if the demo was rehearsed before.

## Backup prompt - Show a summary

Use this only if one of the two live prompts is slow or if you need a quick offline result.

### Say or paste this

> Using the Personal Expense Tracker, show how much I spent in August 2026 and which category had the highest total.

### Expected tool call

The model should call `get_spending_summary` once with:

```json
{
  "month": "2026-08"
}
```

### Expected result

The tool should return the August total and totals grouped by category. Do not promise an exact total because the CSV changes when expenses are added.
