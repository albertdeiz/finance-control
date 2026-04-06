# Finance Control — CLAUDE.md

Personal finance control system focused on financial clarity and forward projection. Not a simple expense tracker — a personal cash-flow simulator that lets you anticipate monthly obligations and make better spending decisions.

---

## Project structure

```
finance-control/                    ← pnpm monorepo root
├── apps/
│   ├── api/                        ← Node + Hono + Prisma (clean architecture)
│   └── web/                        ← Vite + React + shadcn (feature-oriented)
├── packages/
│   └── types/                      ← Shared TypeScript interfaces and DTOs
├── package.json                    ← Workspace root, concurrently dev script
└── pnpm-workspace.yaml
```

---

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Start everything

```bash
pnpm install
PORT=3001 pnpm dev:api    # API on localhost:3001
pnpm dev:web              # Web on localhost:5173
```

Or both together (uses concurrently):

```bash
PORT=3001 pnpm dev
```

### Database setup (first time)

```bash
cd apps/api
pnpm db:migrate           # creates dev.db + runs migrations
pnpm db:generate          # generates Prisma client
pnpm db:studio            # opens Prisma Studio (optional)
```

The database is SQLite locally (`apps/api/prisma/dev.db`). No external services required.

### Ports

| Service | Port |
|---------|------|
| API     | 3001 |
| Web     | 5173 |

The web dev server proxies `/api/*` → `http://localhost:3001` (configured in `apps/web/vite.config.ts`).

---

## API

Base URL (local): `http://localhost:3001`

### Cards

```
GET    /cards
POST   /cards
GET    /cards/:id
PUT    /cards/:id
DELETE /cards/:id
```

### Expenses

```
GET    /expenses
POST   /expenses          ← automatically generates Charge records
GET    /expenses/:id      ← includes associated charges
PUT    /expenses/:id      ← regenerates charges if billing fields change
DELETE /expenses/:id      ← charges deleted via cascade
```

### Projection

```
GET    /projection?months=12          ← monthly timeline (default 12 months)
GET    /projection/:year/:month       ← full breakdown for a specific month
```

### Simulation

```
POST   /simulation        ← preview impact of a new expense without saving
```

---

## Core domain concept: billing cycle

The central rule of the system. A purchase date does not equal the month it gets charged — it depends on the card's cutoff day.

```
Card cutoff: day 5

  Purchase on Apr 3  → billing month = April   (before cutoff)
  Purchase on Apr 6  → billing month = May      (after cutoff → next cycle)
```

This logic lives exclusively in `apps/api/src/shared/billing.ts`:

- `getBillingMonth(purchaseDate, cutoffDay)` — returns `{ year, month }` for the first charge
- `addMonths(base, count)` — advances a `{ year, month }` by N months safely across year boundaries

**All billing logic must go through these two functions.** Never compute billing months inline.

---

## Data model

Three tables in Prisma:

### Card
Represents a credit card. Key fields: `cutoffDay` (when the billing cycle closes) and `paymentDueDay` (when payment is due).

### Expense
A spending entry. Two types stored as a plain string:
- `INSTALLMENT` — fixed number of equal monthly charges (`installmentCount` required)
- `RECURRING` — indefinite or date-bounded monthly charge (`endDate` optional)

`amount` is always the **per-month** amount (for installments: `total / N`).

### Charge
Pre-computed billing entries — one row per expense per billing month. This is what makes projection queries trivial (a simple `SUM` grouped by `billingYear` / `billingMonth`).

```
Charge @@unique([expenseId, billingYear, billingMonth])
Charge @@index([billingYear, billingMonth])
```

When an expense is created, `CreateExpenseUseCase` immediately generates all `Charge` rows:
- `INSTALLMENT` → exactly N rows
- `RECURRING` → up to 24 months ahead (or until `endDate`)

When an expense is updated and any billing field changes, all its charges are deleted and regenerated.

---

## Backend architecture

Clean architecture with four layers. Dependencies only point inward.

```
apps/api/src/
├── domain/                         ← no external dependencies
│   ├── entities/                   ← pure TypeScript interfaces (Card, Expense, Charge)
│   ├── repositories/               ← interfaces only (ICardRepository, etc.)
│   └── errors/                     ← NotFoundError, ValidationError
│
├── application/
│   └── use-cases/                  ← one file per use case, depends on domain interfaces
│       ├── card/                   ← CreateCard, GetCards, GetCard, UpdateCard, DeleteCard
│       ├── expense/                ← CreateExpense, GetExpenses, GetExpense, UpdateExpense, DeleteExpense
│       ├── projection/             ← GetProjection, GetMonthDetail
│       └── simulation/             ← SimulateExpense
│
├── infrastructure/
│   ├── database/
│   │   ├── prisma.client.ts        ← singleton PrismaClient
│   │   └── repositories/           ← Prisma implementations of domain interfaces
│   └── http/
│       ├── routes/                 ← Hono route definitions
│       ├── controllers/            ← thin, call use cases, return JSON
│       └── middleware/             ← error handler
│
└── shared/
    └── billing.ts                  ← getBillingMonth, addMonths
```

### Adding a new use case

1. Create the file in `application/use-cases/<domain>/`
2. Constructor takes repository interfaces (not implementations)
3. Add a method on the relevant controller
4. Register in the route file

Controllers instantiate repositories directly — no DI container. This is intentional for simplicity at this project scale.

---

## Frontend architecture

Feature-oriented. Each feature is self-contained with its own API layer, hooks, components, and pages.

```
apps/web/src/
├── features/
│   ├── cards/
│   │   ├── api/cards.api.ts        ← axios calls, returns typed data
│   │   ├── hooks/useCards.ts       ← TanStack Query wrappers
│   │   ├── components/             ← CardForm, CardItem
│   │   └── pages/CardsPage.tsx
│   ├── expenses/
│   │   ├── api/expenses.api.ts
│   │   ├── hooks/useExpenses.ts    ← invalidates ['projection'] on mutation
│   │   ├── components/             ← ExpenseForm, ExpenseItem
│   │   └── pages/ExpensesPage.tsx
│   ├── projection/
│   │   ├── api/projection.api.ts
│   │   ├── hooks/useProjection.ts
│   │   ├── components/             ← ProjectionChart (recharts), MonthRow
│   │   └── pages/                  ← DashboardPage, MonthDetailPage
│   └── simulation/
│       ├── api/simulation.api.ts
│       ├── hooks/useSimulation.ts  ← useMutation (no cache, preview only)
│       ├── components/             ← SimulationChart (recharts)
│       └── pages/SimulationPage.tsx
│
├── components/
│   ├── layout/Layout.tsx           ← top nav, route wrapper
│   └── ui/                         ← shadcn-style primitives: Button, Input, Card,
│                                      Dialog, Select, Label
│
└── lib/
    ├── api.ts                      ← axios instance (baseURL: '/api')
    └── utils.ts                    ← cn(), formatCurrency(), formatMonth(), monthLabel()
```

### Query key conventions

| Key | Scope |
|-----|-------|
| `['cards']` | all cards |
| `['expenses']` | all expenses |
| `['projection', months]` | projection timeline |
| `['projection', year, month]` | month detail |

When an expense is created or deleted, both `['expenses']` and `['projection']` are invalidated.

### Adding a new feature

1. Create `src/features/<name>/` with `api/`, `hooks/`, `components/`, `pages/`
2. Add the API call in `api/<name>.api.ts` using the shared `api` axios instance
3. Wrap with TanStack Query in `hooks/`
4. Add route in `src/App.tsx`
5. Add nav entry in `src/components/layout/Layout.tsx`

---

## Shared types (`packages/types`)

All DTOs and response interfaces shared between API and web live here. Import as `@finance/types`.

```
packages/types/src/
├── card.ts         ← Card, CreateCardDTO, UpdateCardDTO
├── expense.ts      ← Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseType
├── projection.ts   ← MonthlyProjection, MonthDetail, ChargeDetail, DeltaReason
├── simulation.ts   ← SimulateExpenseDTO, SimulationResult, MonthImpact
└── index.ts        ← re-exports everything
```

If you add a field to an API response, update the type here first. Both apps will immediately reflect the change.

---

## Database notes

### Local (development)
SQLite. No setup required. File lives at `apps/api/prisma/dev.db`.

SQLite limitations that affect the codebase:
- No `enum` type → `ExpenseType` is stored as a plain `String`
- No `Decimal` type → amounts use `Float`
- `createMany` does not support `skipDuplicates` → charge upserts use `prisma.$transaction` with individual `upsert` calls

### Production
Switch to PostgreSQL by updating `apps/api/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then restore the `enum ExpenseType` and `Decimal` types, run `prisma migrate deploy`.

---

## Projection horizon

`RECURRING` expenses generate charges up to **24 months** ahead. This constant is defined in `create-expense.use-case.ts`:

```typescript
const PROJECTION_HORIZON_MONTHS = 24
```

The simulation uses a separate constant of **12 months** for the baseline comparison window. Both can be adjusted independently.

---

## Formatting conventions

- Currency: Chilean Peso (CLP) via `formatCurrency()` in `apps/web/src/lib/utils.ts`
- Locale: `es-CL` throughout
- Dates: ISO 8601 strings on the wire, `Date` objects inside the API, displayed via `formatMonth()` / `monthLabel()`
