# Pond RevOps OS Prototype

A multi-client Revenue Operations dashboard built with Next.js 15, Prisma, SQLite, and Tailwind CSS.

## Features

- **Dashboard** - Executive metrics, pipeline overview, recent activity
- **Clients** - Multi-client management with pipeline metrics
- **Pipeline** - Kanban-style deal board with stage management
- **Deal Detail** - Full deal view with activity timeline and meeting intelligence
- **Meetings** - Calendar and list views with deal association
- **Prospects** - Prospect database with enrichment status and campaign association
- **Outbound** - Campaign management, activity feed, prospect funnel
- **Reports** - Pipeline by stage, client comparison, activity metrics
- **Integrations** - Architecture visualization (prototype only)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI primitives
- **Charts**: Recharts
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Create and seed database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── clients/            # Client management
│   ├── pipeline/           # Deal pipeline
│   ├── deals/[id]/         # Deal detail with intelligence
│   ├── meetings/           # Meeting management
│   ├── prospects/          # Prospect database
│   ├── outbound/           # Outbound campaigns
│   ├── reports/            # Analytics & reporting
│   ├── integrations/       # Architecture visualization
│   └── settings/           # User settings
├── components/
│   ├── layout/             # Sidebar, TopBar, DashboardLayout
│   └── ui/                 # Reusable UI components
├── data/
│   ├── types.ts            # TypeScript interfaces
│   └── mock.ts             # Mock data (legacy)
└── lib/
    ├── prisma.ts           # Prisma client singleton
    ├── utils.ts            # Utility functions
    └── meeting-utils.ts    # Meeting metadata parsing

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Deterministic seed data
```

## Seed Data

The prototype includes deterministic seed data for 3 fictional clients:

1. **Northstar Climate** - Climate/Sustainability (Enterprise, NA)
2. **CivicLayer** - GovTech/Public Infrastructure (Growth, NA)
3. **WellSpring Labs** - Health/Workforce Benefits (Enterprise, EU)

Each client has:
- 8 companies, 12 contacts, 8 deals
- 5 meetings with intelligence (metadata JSON)
- 10 prospects with varied statuses/sources

Total: 24 companies, 36 contacts, 24 deals, 15 meetings, 30 prospects, 96 activities

## Deployment

### SQLite on Vercel Limitation

**Important**: This prototype uses SQLite for simplicity. Vercel's serverless filesystem is **ephemeral** - the SQLite database file (`prisma/dev.db`) will not persist across deployments or function invocations.

**For production deployment**, you have two options:

1. **External Database (Recommended)**: Migrate to PostgreSQL (e.g., Neon, Supabase, PlanetScale, Railway) by:
   - Changing `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`
   - Updating `DATABASE_URL` to a PostgreSQL connection string
   - Running `npx prisma migrate deploy` and `npx prisma db seed`

2. **Vercel Postgres / Neon**: Use Vercel's native Postgres integration

**Current SQLite Setup Works For**:
- Local development
- Single-instance deployments (VPS, Docker, Railway, Fly.io)
- Demo environments where data persistence isn't required across restarts

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string (e.g., `file:./dev.db` for SQLite) |
| `NEXT_PUBLIC_APP_NAME` | No | Application name for UI |

### Production Build

```bash
npm run build
npm run start
```

The build output will be in `.next/` and can be deployed to any Node.js hosting platform.

## Architecture Notes

- All Prisma queries are server-side (Server Components or API routes)
- Client components only receive serialized data via props
- No API routes currently - all data fetching happens in page.tsx Server Components
- Meeting intelligence stored in `Meeting.metadata` as JSON
- Activity types: `EMAIL_SENT`, `EMAIL_OPENED`, `EMAIL_REPLIED`, `LINKEDIN_TASK`, `CALL`, `MEETING`, `DEAL_CREATED`, `STAGE_CHANGED`, `NOTE`

## License

Proprietary prototype - not for production use without proper database migration.