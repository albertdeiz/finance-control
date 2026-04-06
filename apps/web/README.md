# finance-control — Web

React SPA for the finance-control monorepo. Displays credit card projection timelines, manages cards and expenses, and runs what-if simulations against the API.

---

## Tech stack

| Tool | Role |
|---|---|
| [Vite 5](https://vitejs.dev) | Dev server, HMR, and production bundler |
| React 18 + TypeScript | UI framework |
| [TanStack Query v5](https://tanstack.com/query) | Server state — fetching, caching, invalidation |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Stacked bar chart (projection) + line chart (simulation) |
| [Radix UI](https://www.radix-ui.com) primitives | Accessible Dialog, Select, Label components |
| Tailwind CSS 3 | Utility-first styling with CSS variable theming |
| Axios | HTTP client — all requests go through a shared instance |
| `@finance/types` (workspace) | Shared TypeScript types with the API |

---

## Project layout

```
apps/web/
├── index.html
├── vite.config.ts              # @ alias + /api proxy → localhost:3001
├── tailwind.config.ts
└── src/
    ├── main.tsx                # QueryClientProvider (staleTime 5 min), BrowserRouter, ReactDOM.createRoot
    ├── App.tsx                 # All <Route> definitions
    ├── index.css               # Tailwind directives + CSS custom properties for light/dark theming
    ├── lib/
    │   ├── api.ts              # Axios instance — baseURL: '/api'
    │   └── utils.ts            # cn(), formatCurrency() (CLP/es-CL), formatMonth(), monthLabel()
    ├── components/
    │   ├── layout/Layout.tsx   # Top nav with <NavLink> active state
    │   └── ui/                 # Primitive component library (see below)
    └── features/
        ├── cards/
        │   ├── api/cards.api.ts
        │   ├── hooks/useCards.ts           # useCards, useCreateCard, useUpdateCard, useDeleteCard
        │   ├── components/                 # CardForm, CardItem
        │   └── pages/CardsPage.tsx
        ├── expenses/
        │   ├── api/expenses.api.ts
        │   ├── hooks/useExpenses.ts        # useExpenses, useCreateExpense, useDeleteExpense
        │   ├── components/                 # ExpenseForm (also used in SimulationPage), ExpenseItem
        │   └── pages/ExpensesPage.tsx
        ├── projection/
        │   ├── api/projection.api.ts
        │   ├── hooks/useProjection.ts      # useProjection(months), useMonthDetail(year, month)
        │   ├── components/                 # ProjectionChart (stacked bar), MonthRow (clickable)
        │   └── pages/                      # DashboardPage, MonthDetailPage
        └── simulation/
            ├── api/simulation.api.ts
            ├── hooks/useSimulation.ts      # useMutation only — no caching, result is local state
            ├── components/                 # SimulationChart (line: baseline vs withNewExpense)
            └── pages/SimulationPage.tsx
```

### UI component library (`src/components/ui/`)

These are hand-built shadcn/ui-style components, not installed from npm. They wrap Radix UI primitives with Tailwind classes and `cn()` for composability:

- `Button`, `Input`, `Label`
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`

---

## Scripts

```bash
pnpm dev      # Vite dev server on http://localhost:5173 with HMR
pnpm build    # tsc (type check) + vite build → dist/
pnpm preview  # Serve dist/ locally to verify the production build
```

---

## Routes

Defined in `src/App.tsx`. All routes are wrapped in `<Layout>` (the top nav).

| Path | Component | Description |
|---|---|---|
| `/` | — | Redirects to `/dashboard` |
| `/dashboard` | `DashboardPage` | Projection timeline table + stacked bar chart |
| `/projection/:year/:month` | `MonthDetailPage` | Charge-level breakdown for one billing month |
| `/cards` | `CardsPage` | CRUD for credit cards |
| `/expenses` | `ExpensesPage` | CRUD for expenses |
| `/simulation` | `SimulationPage` | What-if analysis for a hypothetical new expense |

---

## API proxy

The Vite dev server proxies all requests starting with `/api` to the API running on `localhost:3001`, stripping the `/api` prefix:

```ts
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
},
```

The Axios instance (`src/lib/api.ts`) uses `baseURL: '/api'`, so a call like `api.get('/cards')` becomes `GET localhost:3001/cards` in dev. In production, configure your reverse proxy to forward `/api/*` to the API host the same way.

**The API must be running on port 3001 for the dev proxy to work.** Start it with `PORT=3001 pnpm dev` from `apps/api/`.

---

## Server state with TanStack Query

The `QueryClient` is configured once in `src/main.tsx` with a global `staleTime` of 5 minutes. All data-fetching hooks are in `features/<feature>/hooks/`.

### Query keys

| Key | Data |
|---|---|
| `['cards']` | All cards |
| `['expenses']` | All expenses |
| `['projection', months]` | Monthly totals for the next N months |
| `['projection', year, month]` | Charge breakdown for one billing month |

### Cache invalidation

Mutations that change expenses invalidate both `['expenses']` and `['projection']` (prefix match), ensuring the dashboard and detail pages refetch:

```ts
// useCreateExpense and useDeleteExpense both do:
onSuccess: () => {
  qc.invalidateQueries({ queryKey: ['expenses'] })
  qc.invalidateQueries({ queryKey: ['projection'] })
}
```

Card mutations only invalidate `['cards']` — they do not touch the projection cache.

### Simulation is not a query

`useSimulation` uses `useMutation`, never `useQuery`. The result of `POST /simulation` is held in local component state inside `SimulationPage` and is never written to the TanStack Query cache. Navigating away discards it.

---

## Feature slice structure

Each feature under `src/features/` follows the same internal layout:

```
features/<name>/
├── api/<name>.api.ts    # Raw Axios calls — returns typed data, no React
├── hooks/use<Name>.ts   # useQuery / useMutation wrappers — the only place that touches TanStack Query
├── components/          # Dumb UI components scoped to this feature
└── pages/<Name>Page.tsx # Route-level component — composes hooks + components
```

Cross-feature component reuse is intentional but minimal: `ExpenseForm` from `features/expenses/components/` is imported directly by `SimulationPage`. If a component is needed by three or more features, move it to `src/components/`.

---

## Theming

CSS custom properties are declared in `src/index.css` as HSL values on `:root` (light) and `.dark` (dark mode). Tailwind's config maps `tailwind.config.ts` semantic tokens (`background`, `foreground`, `primary`, `muted`, etc.) to `hsl(var(--<token>))`. Components use Tailwind classes like `bg-background`, `text-foreground`, and `border-border` — not hardcoded color values.

To change a theme color, edit the CSS variable in `index.css`. No component files need to change.

---

## Utility functions (`src/lib/utils.ts`)

| Function | Signature | Notes |
|---|---|---|
| `cn` | `(...inputs: ClassValue[]) => string` | Merges Tailwind classes via `clsx` + `tailwind-merge` |
| `formatCurrency` | `(amount: number) => string` | CLP, `es-CL` locale, zero decimal places |
| `formatMonth` | `(year: number, month: number) => string` | Full month name + year in Spanish, e.g. `"abril de 2025"` |
| `monthLabel` | `(month: number) => string` | Abbreviated month for chart axes, e.g. `"abr."` |
