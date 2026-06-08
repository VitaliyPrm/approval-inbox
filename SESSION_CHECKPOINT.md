# Approval Inbox — Session Checkpoint

> **Date**: 2026-06-09 02:00
> **Last commit**: `ab2599a` fix(vercel): approve build scripts for sharp and unrs-resolver
> **Tag**: `v0.1.0-mvp`

## 1. Project Summary

All 10 MVP sprints completed. Supabase project is live with migrations. Vercel deployment is in progress but not yet green. The project is a monorepo with Turborepo + pnpm.

## 2. Git History (13 commits)

```
ab2599a (HEAD -> main, origin/main) fix(vercel): approve build scripts for sharp/unrs-resolver
57abfb3 fix(vercel): root-level config for monorepo deployment
6df6b06 fix(vercel): root-level pnpm install for monorepo
eaea240 (tag: v0.1.0-mvp) feat: production setup complete (supabase migration, i18n, deployment guide)
92585f5 feat: deployment infrastructure complete
c7bfb6a checkpoint: sprint-1.10-complete (MVP)
4a3fad9 checkpoint: sprint-1.9-complete
f254791 checkpoint: sprint-1.8-complete
001112e checkpoint: sprint-1.7-complete
aebc3d3 checkpoint: sprint-1.6-complete
937ee44 checkpoint: sprint-1.5-complete
f30c86c checkpoint: sprint-1.4-complete
3561387 checkpoint: sprint-1.3-complete
```

## 3. Supabase Project (Live)

- **Project URL**: `https://gfvswcppnopdpsydswsj.supabase.co`
- **Status**: Fully configured
- **Tables created** (8): `projects`, `project_members`, `files`, `file_versions`, `comments`, `approvals`, `notifications`, `activity_logs`
- **RLS policies**: Active on all tables (owner-scoped, member-scoped)
- **Storage bucket**: `project-files` (private, signed URLs)
- **Auth**: Email/password + email confirmation enabled
- **API Keys** (stored in `.env.local`):
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdnN3Y3Bwbm9wZHBzeWRzd3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODIxNDUsImV4cCI6MjA5NjI1ODE0NX0.o2XmDCIacx72OgjkQhk5N-XEcaAhE7axzzDNUODsqG0`
  - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdnN3Y3Bwbm9wZHBzeWRzd3NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY4MjE0NSwiZXhwIjoyMDk2MjU4MTQ1fQ.GhHAbI0Dq9Mx6ni7XD2NBXlVSw_YG5b17yzwz9vHFpc`
- **Migration file**: `docs/deployment/SUPABASE_MIGRATION.sql`

## 4. Project Structure

```
C:\Projects\approval_inbox\
├── vercel.json                    # Root-level Vercel config
├── .env.example
├── pnpm-workspace.yaml
├── turbo.json
│
├── apps/
│   ├── app/                       # Product app (Next.js 16 + Supabase)
│   │   ├── src/app/
│   │   │   ├── [locale]/          # i18n routes (next-intl)
│   │   │   │   ├── (auth)/login/  # Login page + auth-form.tsx
│   │   │   │   ├── (auth)/signup/ # Signup page
│   │   │   │   ├── (auth)/auth/callback/route.ts
│   │   │   │   ├── dashboard/     # Dashboard page
│   │   │   │   ├── projects/new/  # Create project
│   │   │   │   ├── projects/[id]/ # Project detail + files + comments + approvals
│   │   │   │   ├── notifications/ # Notification list
│   │   │   │   └── c/[token]/     # Client portal
│   │   │   ├── api/               # API routes
│   │   │   │   ├── projects/      # GET/POST + /[id]/share
│   │   │   │   ├── comments/      # GET/POST
│   │   │   │   ├── approvals/     # POST upsert
│   │   │   │   └── notifications/ # GET/PATCH
│   │   │   ├── lib/               # supabase-server, email
│   │   │   ├── components/        # error-boundary, ui (button)
│   │   │   └── emails/            # React Email templates
│   │   ├── e2e/                   # Playwright tests
│   │   └── .env.local             # Supabase keys (gitignored)
│   │
│   └── web/                       # Marketing site
│       └── src/app/
│           ├── page.tsx           # Landing (hero, problem/solution, how it works)
│           ├── features/          # Features grid
│           └── pricing/           # Pricing plans + FAQ
│
├── packages/
│   ├── config/tsconfig/base.json  # Shared TS config
│   └── database/                  # Supabase clients (browser + admin)
│
└── docs/
    ├── INDEX.md
    ├── PRODUCT_SPEC.md
    ├── DIAGNOSTICS_CHECKPOINT.md
    ├── decisions/
    │   ├── 0001-monorepo-with-turborepo.md
    │   └── 0002-authentication-flow.md
    └── deployment/
        ├── DEPLOYMENT_GUIDE.md    # Full deployment walkthrough
        ├── SUPABASE_MIGRATION.sql  # DB schema + RLS + triggers
        └── seed.sql
```

## 5. Tech Stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4 + shadcn/ui |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Auth | Supabase Auth (password + magic-link) |
| Email | Resend + React Email |
| i18n | next-intl (`[locale]` routing, EN + RU) |
| Monorepo | Turborepo + pnpm 11.5.1 |
| Testing | Playwright (14 e2e tests) |
| Deploy | Vercel |

## 6. Vercel Deployment Status

**Status**: ❌ Build failing — `pnpm install` exits with code 1

**Last error**: `Command "pnpm install --no-frozen-lockfile" exited with 1`

**Root cause**: pnpm v11 blocks build scripts for `sharp` and `unrs-resolver`. The `pnpm-workspace.yaml` has `onlyBuiltDependencies` but Vercel may not respect it when running from root.

**Current `vercel.json`**:
```json
{
  "framework": "nextjs",
  "installCommand": "pnpm config set onlyBuiltDependencies '[\"sharp\",\"unrs-resolver\"]' --location project && pnpm install --no-frozen-lockfile",
  "buildCommand": "pnpm --filter @approval-inbox/app build",
  "outputDirectory": "apps/app/.next"
}
```

**Fix attempted but not yet verified**: Added `pnpm config set onlyBuiltDependencies` to the install command in `vercel.json`. Pushed to GitHub at commit `ab2599a`. Needs re-deploy on Vercel.

**Vercel project**: Created as `approval-inbox-app` (or similar name). Environment variables must be set manually in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g., `https://approval-inbox-app.vercel.app`)

## 7. Known Issues

1. **Vercel build failing** — build scripts (sharp, unrs-resolver) blocked by pnpm v11. Fix attempted via `onlyBuiltDependencies` in vercel.json install command. Not yet verified.
2. **Tw-animate-css import removed** — the CSS file had `@import "tw-animate-css"` and `@import "shadcn/tailwind.css"` which Next.js 16 Turbopack cannot resolve in CSS. Removed these imports. Animation classes may not work.
3. **Old `(auth)` route group** — still exists alongside the new `[locale]/(auth)` routes. The old files can be deleted once the `[locale]` routes are confirmed working.
4. **Resend API key** — not yet obtained. Email sending (magic links, notifications) will fail until `RESEND_API_KEY` is set in `.env.local` and Vercel env vars.
5. **Client portal share token** — the route `/c/[token]` exists but the test with curl showed 307 redirect. Might need fixing for client portal access without locale prefix.

## 8. Pending Tasks & Next Steps

### To finish deployment (Vercel):
1. Re-deploy the Vercel project (triggered by push, or manually click "Redeploy")
2. If still failing, try: in Vercel, change `Node.js Version` to `22.x` in Project Settings
3. If still failing, try: remove `vercel.json` entirely and configure build settings manually in Vercel Dashboard

### To continue development:
1. Set up Resend account and add `RESEND_API_KEY` to `.env.local`
2. Clean up old route files: `apps/app/src/app/(auth)/`, `apps/app/src/app/dashboard/` etc.
3. Verify `www/` marketing site deployment separately
4. Set up custom domain: `approvalinbox.app` + `app.approvalinbox.app`

## 9. How to Start Dev Server

```bash
cd C:\Projects\approval_inbox\apps\app
npx next dev --port 3000
# Open http://localhost:3000/en/login
```

## 10. How to Run Tests

```bash
cd C:\Projects\approval_inbox\apps\app
npx playwright test
```

## 11. Key Credentials (for AI assistant continuation)

```json
{
  "supabase": {
    "url": "https://gfvswcppnopdpsydswsj.supabase.co",
    "projectRef": "gfvswcppnopdpsydswsj"
  },
  "github": {
    "repo": "VitaliyPrm/approval-inbox",
    "branch": "main"
  },
  "vercel": {
    "projectName": "approval-inbox-app",
    "rootDirectory": "(root)",
    "pendingEnvVars": ["RESEND_API_KEY", "NEXT_PUBLIC_POSTHOG_KEY"]
  },
  "lastCommit": {
    "hash": "ab2599a",
    "message": "fix(vercel): approve build scripts for sharp and unrs-resolver"
  }
}