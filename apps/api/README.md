# finance-control — API

Node.js REST API for the finance-control monorepo. Built with **Hono**, **Prisma**, and **TypeScript**, following a strict clean architecture layering.

---

## Tech stack

| Tool | Role |
|---|---|
| [Hono](https://hono.dev) + `@hono/node-server` | HTTP framework and server adapter |
| [Prisma 5](https://www.prisma.io) | ORM — SQLite locally, PostgreSQL in production |
| [tsx watch](https://github.com/privatenumber/tsx) | Dev hot-reload (no compilation step) |
| `@finance/types` (workspace) | Shared TypeScript types between API and web |
| Zod | Request validation (used selectively in controllers) |

---

## Project layout

```
apps/api/
├── prisma/
│   ├── schema.prisma           # Card, Expense, Charge models
│   ├── migrations/             # Generated migration history
│   └── dev.db                  # SQLite file — local only, gitignored
└── src/
    ├── domain/
    │   ├── entities/           # CardEntity, ExpenseEntity, ChargeEntity — pure TS interfaces, no framework deps
    │   ├── repositories/       # ICardRepository, IExpenseRepository, IChargeRepository — contracts only
    │   └── errors/             # NotFoundError, ValidationError (extend Error)
    ├── application/
    │   └── use-cases/
    │       ├── card/           # CreateCard, GetCards, GetCard, UpdateCard, DeleteCard
    │       ├── expense/        # CreateExpense, GetExpenses, GetExpense, UpdateExpense, DeleteExpense
    │       ├── projection/     # GetProjection, GetMonthDetail
    │       └── simulation/     # SimulateExpense
    ├── infrastructure/
    │   ├── database/
    │   │   ├── prisma.client.ts                     # Singleton PrismaClient
    │   │   └── repositories/                        # PrismaCardRepository, PrismaExpenseRepository, PrismaChargeRepository
    │   └── http/
    │       ├── routes/         # card.routes.ts, expense.routes.ts, projection.routes.ts, simulation.routes.ts
    │       ├── controllers/    # card.controller.ts, expense.controller.ts, projection.controller.ts, simulation.controller.ts
    │       └── middleware/     # error.middleware.ts
    ├── shared/
    │   └── billing.ts          # getBillingMonth(), addMonths()
    └── main.ts                 # Hono app — mounts routes, global error handler, starts server
```

---

## Scripts

```bash
pnpm dev          # tsx watch src/main.ts — hot-reloads on any change
pnpm build        # tsc — compiles to dist/
pnpm start        # node dist/main.js — runs compiled output
pnpm db:migrate   # prisma migrate dev — runs pending migrations against dev.db
pnpm db:generate  # prisma generate — regenerates the Prisma client after schema changes
pnpm db:studio    # prisma studio — opens browser-based DB GUI on port 5555
```

---

## Environment

The server reads one env variable:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the Hono server binds to |

No `.env` file is required for local development. The SQLite database URL is hardcoded directly in `prisma/schema.prisma` as `file:./dev.db`. For production (PostgreSQL), set `DATABASE_URL` and update the datasource provider.

```bash
# Override the port without touching any config file
PORT=3001 pnpm dev
```

---

## API endpoints

### Cards

```
GET    /cards              List all cards
POST   /cards              Create a card
GET    /cards/:id          Get one card by id
PUT    /cards/:id          Update a card
DELETE /cards/:id          Delete a card
```

A card carries the fields that drive the billing cycle: `cutoffDay` (1–31) and `paymentDueDay`. Optional fields: `bank`, `color`, `creditLimit`.

### Expenses

```
GET    /expenses           List all expenses
POST   /expenses           Create an expense (also pre-generates Charges — see below)
GET    /expenses/:id       Get one expense by id
PUT    /expenses/:id       Update an expense
DELETE /expenses/:id       Delete an expense (cascades to its Charges)
```

Expense `type` is either `"INSTALLMENT"` or `"RECURRING"`. For installments, `installmentCount` is required. For recurring expenses, `endDate` is optional; if omitted, charges are generated up to the 24-month horizon.

### Projection

```
GET    /projection?months=12      Monthly totals for the next N months (default 12)
GET    /projection/:year/:month   Full charge breakdown for one specific billing month
```

### Simulation

```
POST   /simulation         Compute what the projection would look like with a hypothetical new expense
```

The simulation endpoint accepts the same payload as `POST /expenses` but never writes to the database. It returns `{ baseline, withNewExpense, impact }`.

---

## Core concepts

### Billing month (`getBillingMonth`)

Located in `src/shared/billing.ts`. The billing month for a purchase is determined by the card's `cutoffDay`:

- If the purchase date's day is **on or before** the cutoff, it lands in the **same calendar month**.
- If the purchase date's day is **after** the cutoff, it rolls into the **next calendar month**.

```ts
// Purchase on the 20th, cutoffDay = 15 → next month
getBillingMonth(new Date('2025-03-20'), 15) // { year: 2025, month: 4 }

// Purchase on the 10th, cutoffDay = 15 → same month
getBillingMonth(new Date('2025-03-10'), 15) // { year: 2025, month: 3 }
```

`addMonths` is the companion function that advances a `{ year, month }` by N steps without overflowing December.

### The Charge table and why it exists

`Expense` stores the source record (what was purchased, on which card, how many installments). `Charge` is the pre-computed ledger entry: one row per billing month per expense. This denormalization makes projection queries trivial — they just `groupBy billingYear, billingMonth` with `SUM(amount)` rather than recalculating installment schedules on every request.

Charges are generated eagerly when an expense is created:
- **INSTALLMENT**: one `Charge` per installment, spread over N consecutive billing months starting from `firstBilling`.
- **RECURRING**: one `Charge` per month up to 24 months from `firstBilling`, or until `endDate` if set.

The unique constraint `@@unique([expenseId, billingYear, billingMonth])` prevents duplicate charges. `createMany` is implemented as a `prisma.$transaction` of individual `upsert` calls (required for SQLite compatibility — see below).

### Projection horizon constants

Two constants govern how far ahead the system looks:

| Constant | Value | Where used |
|---|---|---|
| `PROJECTION_HORIZON_MONTHS` (in `create-expense`) | 24 | How many months of Charges are pre-generated for RECURRING expenses |
| `PROJECTION_HORIZON_MONTHS` (in `simulate-expense`) | 12 | How many months the baseline projection covers in simulation output |
| `SIMULATION_HORIZON_MONTHS` (in `simulate-expense`) | 24 | How many months a RECURRING simulated expense is projected forward |

### Clean architecture layers and dependency direction

```
domain ← application ← infrastructure
```

- **Domain** (`src/domain/`) has zero external dependencies. Entities are plain interfaces; repositories are abstract contracts.
- **Application** (`src/application/use-cases/`) depends only on domain interfaces. Each use case receives its repository dependencies via constructor injection.
- **Infrastructure** (`src/infrastructure/`) provides concrete implementations: Prisma repositories and Hono controllers/routes. Controllers instantiate use cases manually, passing in the concrete repos — no IoC container.

Domain errors (`NotFoundError`, `ValidationError`) are thrown from use cases and caught at the top-level `app.onError` handler in `main.ts`, which maps them to the appropriate HTTP status codes (404 / 400).

### SQLite vs PostgreSQL differences

The schema uses `sqlite` as the provider locally. Several Prisma features behave differently:

| Feature | SQLite (local) | PostgreSQL (prod) |
|---|---|---|
| Enum types | Modeled as `String` with app-level validation | Can use native `enum` |
| Decimal fields | Modeled as `Float` | Can use `Decimal` |
| `createMany` with `skipDuplicates` | **Not supported** — use `upsert` in a `$transaction` | Supported natively |

The `PrismaChargeRepository.createMany` already uses the `upsert` pattern to remain compatible with both providers.

---

## Adding a new use case

1. **Define the interface** — if you need a new repository method, add it to the relevant interface in `src/domain/repositories/`.
2. **Implement the use case** — create a new file under `src/application/use-cases/<feature>/`. The class constructor takes repository interfaces as arguments.
3. **Implement the repository method** — add the concrete implementation in `src/infrastructure/database/repositories/`.
4. **Wire it up** — add a handler to the relevant controller in `src/infrastructure/http/controllers/`, then register the route in `src/infrastructure/http/routes/`.

No service locator or DI framework — just pass the concrete repository instances directly in the controller handler.
