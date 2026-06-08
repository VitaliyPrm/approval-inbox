# Approval Inbox — Session Checkpoint

> **Date**: 2026-06-09 02:18
> **Last commit**: `e614950` fix(pnpm-workspace): allowBuilds bools instead of placeholders; simplify vercel.json
> **Status**: ✅ All pages working in dev (+ fixes below)

## 1. Changes Made This Session

### Infrastructure fixes
- **pnpm-workspace.yaml**: Исправлены `allowBuilds` — убраны заглушки `"set this to true or false"`, проставлены правильные `true`/`false` для sharp и unrs-resolver
- **vercel.json**: Упрощён `installCommand` — убран хак с `pnpm config set onlyBuiltDependencies`, т.к. pnpm-workspace.yaml теперь корректный

### Route cleanup
- Удалены старые нелокализованные route файлы: `(auth)`, `dashboard`, `notifications`, `projects` из корня `apps/app/src/app/`
- **Client portal** (`/c/[token]/`): перенесён в `[locale]/c/[token]/` с локализацией
  - `page.tsx`, `client-file-list.tsx`, `client-comment-section.tsx`

### i18n & middleware fixes
- **routing.ts**: `localePrefix` изменён с `"as-needed"` на `"always"` — иначе клиентский портал `/c/...` не матчился с `[locale]/c/[token]`
- **middleware.ts**: Исправлен порядок — i18n обработка (`intlMiddleware`) выполняется раньше проверок auth, добавлен ранний return `NextResponse.next()` для `/c/` чтобы не проверять auth на клиентском портале

## 2. Dev Server Verification

| URL | Status |
|---|---|
| `/en/login` | ✅ 200 |
| `/en/signup` | ✅ 200 |
| `/ru/login` | ✅ 200 (русский язык работает) |
| `/en/dashboard` | ✅ 307 → `/en/login` (правильно — не аутентифицирован) |
| `/en/c/test-token` | ✅ 200 |

## 3. Supabase Project (Live — unchanged)

- **Project URL**: `https://gfvswcppnopdpsydswsj.supabase.co`
- **Status**: Fully configured
- **Tables created** (8): `projects`, `project_members`, `files`, `file_versions`, `comments`, `approvals`, `notifications`, `activity_logs`
- **RLS policies**: Active on all tables
- **Storage bucket**: `project-files` (private, signed URLs)
- **Auth**: Email/password + email confirmation enabled

## 4. Project Structure (current)

```
C:\Projects\approval_inbox\
├── vercel.json                      # Updated: simpler installCommand
├── .env.example
├── pnpm-workspace.yaml              # Updated: correct allowBuilds
├── turbo.json
│
├── apps/
│   ├── app/                         # Product app (Next.js 16 + Supabase)
│   │   ├── src/
│   │   │   ├── middleware.ts        # Fixed: i18n first, skip /c/ for auth
│   │   │   ├── i18n/routing.ts      # Fixed: localePrefix: "always"
│   │   │   └── app/
│   │   │       ├── [locale]/
│   │   │       │   ├── (auth)/login/      # Login page + auth-form.tsx
│   │   │       │   ├── (auth)/signup/     # Signup page
│   │   │       │   ├── (auth)/auth/callback/route.ts
│   │   │       │   ├── dashboard/         # Dashboard page
│   │   │       │   ├── projects/new/      # Create project
│   │   │       │   ├── projects/[id]/     # Project detail
│   │   │       │   ├── notifications/     # Notification list
│   │   │       │   └── c/[token]/         # Client portal (NEW location)
│   │   │       ├── api/               # API routes
│   │   │       └── lib/ + components/ + emails/
│   │   └── .env.local
│   └── web/                           # Marketing site
│       └── src/app/ (page.tsx, features/, pricing/)
│
├── packages/
│   ├── config/tsconfig/base.json
│   └── database/                     # Supabase clients (browser + admin)
│
└── docs/
    ├── INDEX.md
    ├── PRODUCT_SPEC.md
    ├── decisions/
    └── deployment/
        ├── DEPLOYMENT_GUIDE.md
        ├── SUPABASE_MIGRATION.sql
        └── seed.sql
```

## 5. Tech Stack (locked — unchanged)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4 + shadcn/ui |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Auth | Supabase Auth (password + magic-link) |
| Email | Resend + React Email |
| i18n | next-intl (`[locale]` routing, EN + RU, prefix always) |
| Monorepo | Turborepo + pnpm 11.5.1 |
| Testing | Playwright (14 e2e tests) |
| Deploy | Vercel |

## 6. Vercel Deployment Status

**Status**: ❌ Build failing — `pnpm install` exits with code 1

**Fix applied & pushed** (`e614950`):
- `allowBuilds` в `pnpm-workspace.yaml` исправлены
- `vercel.json` упрощён

**Needs**: повторный деплой на Vercel (push уже на GitHub)

## 7. Known Issues

1. ❌ **Vercel build failing** — исправления запущены, ждём повторного деплоя
2. ⚠️ **Tw-animate-css import removed** — animation classes may not work
3. ⚠️ **Resend API key** — not yet obtained. Email sending will fail
4. ⚠️ **middleware deprecation** — Next.js 16 warns `middleware` → `proxy`, но миграция не требуется срочно

## 8. How to Start Dev Server

```bash
cd C:\Projects\approval_inbox\apps\app
npx next dev --port 3000
# Open http://localhost:3000/en/login