# Finance Control

Personal finance control system focused on clarity and forward projection. Not a simple expense tracker — a cash-flow simulator that helps you anticipate monthly credit card obligations and make better spending decisions.

The core problem it solves: a purchase made on April 10th on a card with a cutoff on the 5th does **not** hit your April bill — it hits May. This system understands billing cycles and projects your real monthly obligations accordingly.

---

## What it does

- Manage multiple credit cards, each with its own cutoff and payment due day
- Register installment expenses (fixed number of monthly charges) and recurring expenses (ongoing monthly charges)
- Project your total monthly obligations up to 12–24 months ahead
- See month-by-month breakdowns: what you owe, what ends, what continues
- Simulate new purchases before making them — see exactly how they shift your future obligations per month

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| API | Node.js + [Hono](https://hono.dev) |
| ORM | [Prisma](https://prisma.io) |
| Database (local) | SQLite |
| Database (prod) | PostgreSQL |
| Frontend | React 18 + Vite |
| UI components | Radix UI + Tailwind CSS (shadcn-style) |
| Server state | TanStack Query |
| Routing | React Router v6 |
| Charts | Recharts |
| Package manager | pnpm (workspaces) |
| Language | TypeScript throughout |

---

## Monorepo structure

```
finance-control/
├── apps/
│   ├── api/            → REST API (clean architecture)
│   └── web/            → React SPA (feature-oriented)
├── packages/
│   └── types/          → Shared TypeScript interfaces and DTOs
├── CLAUDE.md           → AI assistant context and architecture reference
├── .gitignore
└── pnpm-workspace.yaml
```

Each app has its own README with full details:
- [`apps/api/README.md`](apps/api/README.md)
- [`apps/web/README.md`](apps/web/README.md)

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)

### Install

```bash
git clone <repo-url>
cd finance-control
pnpm install
```

### Database setup

```bash
cd apps/api
pnpm db:migrate     # creates dev.db and runs migrations
pnpm db:generate    # generates Prisma client
```

### Run

```bash
# From repo root — starts both API and web concurrently
PORT=3001 pnpm dev
```

Or run them separately:

```bash
PORT=3001 pnpm dev:api    # API on http://localhost:3001
pnpm dev:web              # Web on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## How billing cycles work

This is the central concept of the system.

```
Card cutoff: day 5

  Purchase on Apr 3  (before cutoff) → billed in April  → pay in May
  Purchase on Apr 8  (after cutoff)  → billed in May    → pay in June
```

When you register an expense, the system calculates which billing month each charge falls into and stores it as a pre-computed `Charge` record. Projection queries then become a simple monthly aggregation over those records.

---

## Expense types

| Type | Description |
|------|-------------|
| `INSTALLMENT` | Fixed number of equal monthly charges (e.g. 12-month financing) |
| `RECURRING` | Ongoing monthly charge with an optional end date (e.g. subscriptions) |

---

## Project scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start API + web concurrently |
| `pnpm dev:api` | Start API only |
| `pnpm dev:web` | Start web only |
