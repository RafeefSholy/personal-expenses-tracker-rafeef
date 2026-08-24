import { z } from "zod/v4";

export const MAX_EXPENSE_AMOUNT = 1_000_000;

// These field schemas are factories rather than shared instances. The MCP SDK
// converts and caches each registered input schema; giving every tool its own
// schema graph prevents registration metadata from coupling unrelated tools.
function createAmountSchema() {
  return z
    .number({ error: "Amount must be a number" })
    .finite("Amount must be finite")
    .positive("Amount must be greater than zero")
    .max(
      MAX_EXPENSE_AMOUNT,
      `Amount must be at most ${MAX_EXPENSE_AMOUNT}`,
    )
    .describe(`The expense amount, up to ${MAX_EXPENSE_AMOUNT}`);
}

function createCategorySchema() {
  return z
    .string({ error: "Category must be a string" })
    .trim()
    .min(1, "Category must not be empty")
    .max(30, "Category must be at most 30 characters")
    .refine(
      (category) => !/[<>]/.test(category),
      "Category must not contain HTML markup characters (< or >)",
    )
    .transform((category) => category.toLowerCase())
    .describe("The normalized expense category");
}

function createExpenseDateSchema() {
  return z
    .string({ error: "Date must be a string" })
    .regex(
      /^(?!0000)\d{4}-\d{2}-\d{2}$/,
      "Date must use YYYY-MM-DD format",
    )
    .refine((date) => {
      const parsedDate = new Date(`${date}T00:00:00Z`);

      return !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === date;
    }, "Date must be a valid calendar date")
    .describe("The expense date in YYYY-MM-DD format");
}

function createMonthSchema() {
  return z
    .string({ error: "Month must be a string" })
    .regex(
      /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/,
      "Month must use YYYY-MM format",
    )
    .describe("A calendar month in YYYY-MM format");
}

function createDescriptionSchema() {
  return z
    .string({ error: "Description must be a string" })
    .trim()
    .min(1, "Description must not be empty")
    .max(100, "Description must be at most 100 characters")
    .describe("A short optional description of the expense");
}

function createExpenseIdSchema() {
  return z
    .string({ error: "Expense ID must be a string" })
    .min(1, "Expense ID must not be empty")
    .max(100, "Expense ID must be at most 100 characters")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9_-]*$/,
      "Expense ID may only contain letters, numbers, underscores, and hyphens",
    )
    .describe("The ID of the expense");
}

export function createAddExpenseInputSchema() {
  return z.object({
    amount: createAmountSchema(),
    category: createCategorySchema(),
    date: createExpenseDateSchema(),
    description: createDescriptionSchema().optional(),
  }).strict();
}

export function createUpdateExpenseInputSchema() {
  return z
    .object({
      id: createExpenseIdSchema(),
      amount: createAmountSchema().optional(),
      category: createCategorySchema().optional(),
      date: createExpenseDateSchema().optional(),
      description: createDescriptionSchema().optional(),
    })
    .strict()
    .refine(
      ({ amount, category, date, description }) =>
        amount !== undefined ||
        category !== undefined ||
        date !== undefined ||
        description !== undefined,
      {
        message: "At least one expense field must be supplied",
      },
    );
}

export function createDeleteExpenseInputSchema() {
  return z.object({ id: createExpenseIdSchema() }).strict();
}

export function createListExpensesInputSchema() {
  return z.object({
    month: createMonthSchema().optional(),
    category: createCategorySchema().optional(),
  }).strict();
}

export function createGetSpendingSummaryInputSchema() {
  return z.object({
    month: createMonthSchema().optional(),
  }).strict();
}

export const addExpenseInputSchema = createAddExpenseInputSchema();
export const updateExpenseInputSchema = createUpdateExpenseInputSchema();
export const deleteExpenseInputSchema = createDeleteExpenseInputSchema();
export const listExpensesInputSchema = createListExpensesInputSchema();
export const getSpendingSummaryInputSchema =
  createGetSpendingSummaryInputSchema();

export const getSpendingSummaryOutputSchema = z.object({
  month: z.union([
    z.literal("all"),
    z.string().regex(
      /^\d{4}-(0[1-9]|1[0-2])$/,
      "Month must use YYYY-MM format",
    ),
  ]),

  totalAmount: z.number().nonnegative(),

  expenseCount: z.number().int().nonnegative(),

  categoryTotals: z.record(
    z.string(),
    z.number().nonnegative(),
  ),

  message: z.enum([
    "no matching expenses found",
    "spending summary created",
  ]),
});
//csv row validation schema 
//This checks that every expense loaded from the CSV has:
//id amount category date description
export const expenseRowSchema = z.object({
  id: createExpenseIdSchema(),

  amount: z.union([
    createAmountSchema(),
    z
      .string()
      // csv-stringify uses JavaScript's canonical number representation, which
      // includes exponent notation for values such as 1e-7. Accept exactly the
      // finite positive forms that our own writer can emit, then reapply all
      // numeric bounds after conversion.
      .regex(
        /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/,
        "Amount must be a decimal number",
      )
      .transform(Number)
      .pipe(createAmountSchema()),
  ]),

  category: createCategorySchema(),

  date: createExpenseDateSchema(),

  description: z
    .string()
    .max(100)
    .transform((description) => description.trim()),
}).strict();

export type ExpenseRow = z.infer<typeof expenseRowSchema>;
