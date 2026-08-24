export class ExpenseNotFoundError extends Error {
  constructor() {
    super("expense not found");
    this.name = "ExpenseNotFoundError";
  }
}
