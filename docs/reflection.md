# Six-Week Project Reflection

## Wins

- I shipped a public MCP server instead of stopping at a classroom prototype.
- I built five working tools: `add_expense`, `list_expenses`, `get_spending_summary`, `update_expense`, and `delete_expense`.
- I used TypeScript and Zod to check tool input before it could reach the expense data.
- I made the local CSV storage safer by validating rows, limiting file access, and protecting write operations.
- I added focused tests for valid calls, bad input, damaged CSV data, and repeated writes. The final test suite has 25 passing tests.
- I prepared a five-minute live demo, tested the project from a fresh clone, and published the `v1.0.0` tag.

## Blockers

The hardest part was making CSV writes safe. Adding a row is simple, but update and delete must change one record without damaging or losing the other records.

It was also difficult to handle damaged CSV data correctly. The server needed to stop safely instead of rewriting or deleting bad data.

Another challenge was treating every MCP request as untrusted input. I had to check real dates, months, IDs, amounts, text limits, and unexpected fields while still returning short and useful errors.

Git branches and rebases were sometimes confusing because I needed to keep the security work while cleaning the repository for the final release.

## Resume Bullet

- Built and shipped a public personal-expense MCP server with TypeScript and Zod, delivering five tested tools for adding, listing, summarizing, updating, and deleting expenses with safe local CSV storage and a live Demo Day workflow.

## Resume Blurb

I built a Personal Expense Tracker MCP server using TypeScript, Zod, and the Model Context Protocol. The server provides five working expense tools with strict input validation and limited access to one local CSV file. I added 25 tests covering normal use, invalid input, damaged data, and concurrent writes. I published the repository, tested it from a fresh clone, tagged version `v1.0.0`, and prepared a live five-minute demo.

## LinkedIn Draft

After six weeks of work, I shipped my Personal Expense Tracker MCP project. I built five expense tools with TypeScript, Zod, and the Model Context Protocol, then added validation and tests to keep local CSV data safe. The project is public, tagged as `v1.0.0`, and tested from a fresh clone. The biggest lesson was that a useful AI tool also needs clear limits, safe failure behavior, and a demo that another person can run.

## One Improvement for the Next Two Weeks

I would add a read-only spending trends tool that compares the last three months. It would show monthly totals and the highest category without adding any new write or file permissions. I would keep the response bounded and add tests for missing months, damaged rows, and large expense files.
