# Personal Expense Tracker MCP

## What This Project Does

Personal Expense Tracker MCP is a simple local MCP server for tracking personal expenses

It stores expense data in a local CSV file

The server gives an MCP client five focused tools

- add a new expense
- list saved expenses
- create a spending summary
- update an existing expense
- delete an existing expense

The project is made to be simple and easy to run locally

No bank account or external API is needed

---

## Requirements

Before starting make sure you have these installed

- Node.js version 20 or newer
- npm
- Git

Check Node.js

```bash
node --version
```

Check npm

```bash
npm --version
```

Check Git

```bash
git --version
```

---

## Install

### 1 Clone the repository

```bash
git clone https://github.com/MohammadYousef-001/Personal-Expenses-Tracker.git
```

### 2 Enter the project folder

```bash
cd Personal-Expenses-Tracker
```

### 3 Install the packages

```bash
npm install
```

Wait until npm finishes installing the required packages

---

## Data File

Expenses are stored locally in

```text
data/expenses.csv
```

The CSV file uses these columns

```text
id,amount,category,date,description
```

Do not change the column names

---

## Run the MCP Server

To start the server run

```bash
npm run dev
```

The server uses standard input and output for MCP communication

It is a local server and does not need a web port

---

## Run MCP Inspector

MCP Inspector is the easiest way to test the tools manually

Run

```bash
npm run inspect
```

A browser window should open with MCP Inspector

If it does not open automatically use the URL shown in the terminal

In Inspector

1. connect to the server
2. open the Tools section
3. choose a tool
4. enter the input
5. click Execute Tool
6. check the result

---

## Available Tools

| Tool | What It Does | Main Inputs |
| --- | --- | --- |
| `add_expense` | adds a new expense to the CSV file | amount category date description |
| `list_expenses` | lists saved expenses and can filter them | month category |
| `get_spending_summary` | calculates spending totals for a month | month |
| `update_expense` | updates one existing expense | id and at least one expense field |
| `delete_expense` | deletes one existing expense | id |

---

## Tool 1 add_expense

Use `add_expense` to save a new expense

### Inputs

`amount`

The amount of money spent

It must be a positive number

`category`

The expense category

Examples

```text
groceries
transport
bills
shopping
```

The category is stored in lowercase so category names stay consistent

`date`

The expense date

It must use

```text
YYYY-MM-DD
```

Example

```text
2026-08-12
```

The date must also be a real calendar date

This is invalid

```text
2026-99-99
```

`description`

Optional short information about the expense

### Example

```json
{
  "amount": 25,
  "category": "groceries",
  "date": "2026-08-12",
  "description": "milk and bread"
}
```

A successful request adds the expense to

```text
data/expenses.csv
```

---

## Tool 2 list_expenses

Use `list_expenses` to view saved expenses

Without filters

```json
{}
```

Filter by category

```json
{
  "category": "groceries"
}
```

Filter by month

```json
{
  "month": "2026-08"
}
```

Use both filters

```json
{
  "month": "2026-08",
  "category": "groceries"
}
```

The month must use

```text
YYYY-MM
```

The month must be between `01` and `12`

This is invalid

```text
2026-99
```

---

## Tool 3 get_spending_summary

Use `get_spending_summary` to see a summary of your spending

Example

```json
{
  "month": "2026-08"
}
```

The result can include

- selected month
- total amount spent
- number of expenses
- total spending for each category

Example result

```text
month: 2026-08
total amount: 150
expense count: 4

category totals:
groceries: 80
transport: 30
bills: 40
```

The real values depend on the data inside `data/expenses.csv`

---

## Example Prompts

### Add an expense

```text
I spent 25 on groceries today
```

This can use

```text
add_expense
```

### Find expenses

```text
show my grocery expenses for this month
```

This can use

```text
list_expenses
```

### Check spending

```text
how much did I spend this month
```

This can use

```text
get_spending_summary
```

---

## Input Validation

The project checks tool input before using it

Examples of invalid input

- negative amount
- zero amount
- wrong date format
- impossible calendar date
- invalid month
- category that is too long
- description that is too long

Invalid input is rejected before it is saved

---

## Test the Schemas

Run

```bash
npm run check:schema
```

A successful result should show

```text
All expense schemas are valid.
```

---

## Troubleshooting

### Problem 1 packages are missing

If you see an error saying a package or module cannot be found run

```bash
npm install
```

Then try again

```bash
npm run dev
```

---

### Problem 2 MCP Inspector does not start

Make sure the packages are installed

```bash
npm install
```

Then run

```bash
npm run inspect
```

If an old Inspector process is still running press

```text
Ctrl + C
```

Then start Inspector again

---

### Problem 3 TypeScript or schema error

Run

```bash
npm run check:schema
```

If everything is correct you should see

```text
All expense schemas are valid.
```

If there is an error check the file name and line number shown in the terminal

Fix the error before starting Inspector again

---

### Problem 4 invalid date

A valid date must use

```text
YYYY-MM-DD
```

Valid example

```text
2026-08-12
```

Invalid example

```text
2026-99-99
```

---

### Problem 5 no expenses are returned

Check

```text
data/expenses.csv
```

Make sure it contains expense rows below the CSV header

If the file only contains the header then an empty result is normal

---

## Project Structure

Important project files

```text
Personal-Expenses-Tracker/
│
├── data/
│   └── expenses.csv
│
├── docs/
│   ├── design.md
│   └── threat-model.md
│
├── examples/
│
├── src/
│   ├── index.ts
│   ├── schemas/
│   ├── tools/
│   └── lib/
│
├── SECURITY.md
├── package.json
└── README.md
```

---

## Security

Tool input is treated as untrusted input

The project validates input before important operations

The expense file path is controlled by the application

Errors returned to the MCP client are kept short

More detailed errors stay in the local terminal for debugging

The expense tools do not require external network requests

More security information is available in

```text
SECURITY.md
```

---

## Project Scope

This project is a small local personal expense tracker

It does not include

- bank account connections
- automatic bank imports
- user login
- cloud database
- full graphical application
- financial forecasting

The main goal is to provide simple MCP tools for local expense tracking

---

## License

This project uses the MIT License

See [LICENSE](LICENSE)

