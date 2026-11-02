# ERP

Multi-tenant ERP dashboard for inventory, HR, finance, and reports.

Live: https://erp.lakshyeah.in

## Stack

- Next.js (App Router) + React + TypeScript
- Prisma + PostgreSQL
- Supabase Auth (SSR)
- Tailwind CSS
- Export helpers: xlsx, jsPDF

## Modules

- **Inventory** — products, SKUs, stock IN/OUT/ADJUSTMENT
- **HR** — employees, departments, salary
- **Finance** — income/expense transactions by category
- **Reports / settings** — org branding, currency, role-aware access

Tenancy is scoped by `Organization`. Users map to Supabase Auth IDs with roles `OWNER`, `ADMIN`, `MANAGER`, `EMPLOYEE`.

## Setup

```bash
npm install
cp .env.example .env   # if present; otherwise create .env
```

Required env (typical):

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000.

## Docs

See `docs/api_documentation.md` for the REST outline (auth, org, inventory). Production routes live under the Next.js app (`src/app/dashboard/...`).
