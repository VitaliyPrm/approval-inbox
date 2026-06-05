# Approval Inbox

> **Client approvals without chaos.**  
> A lightweight client approval system for freelancers and agencies.

## 🚀 Live

- **Marketing site**: [approvalinbox.app](https://approvalinbox.app)
- **App**: [app.approvalinbox.app](https://app.approvalinbox.app)

## ✨ Features (MVP)

- **Auth** — password login for owners, magic-link for clients
- **Projects** — create, share, manage client work
- **File upload** — drag-and-drop, any format
- **Comments** — text threads, pin comments on images/PDFs
- **Approvals** — approve / reject / changes requested with sticky status
- **Activity timeline** — every action logged chronologically
- **Notifications** — in-app + email (Resend + React Email)
- **Client portal** — share projects via token, no account needed
- **i18n** — English + Russian (next-intl)
- **Marketing site** — landing, features, pricing with FAQ

## 🏗️ Architecture

```
approval-inbox/
├── apps/
│   ├── web/          # Marketing site (Next.js 16)
│   └── app/          # Product app (Next.js 16 + Supabase)
├── packages/
│   ├── config/       # Shared TypeScript config
│   └── database/     # Supabase client (browser + admin)
├── docs/             # English-only project docs
└── turbo.json        # Turborepo pipeline
```

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4 + shadcn/ui |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Auth | Supabase Auth (password + magic-link) |
| Email | Resend + React Email |
| i18n | next-intl |
| Monorepo | Turborepo + pnpm |
| Testing | Playwright + Vitest |
| Deploy | Vercel |

## 🧑‍💻 Local Development

```bash
# Clone & install
git clone https://github.com/VitaliyPrm/approval-inbox.git
cd approval-inbox
pnpm install

# Copy environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run apps
pnpm dev          # runs both apps
pnpm --filter app dev  # product app only
pnpm --filter web dev  # marketing site only

# Run tests
pnpm test:e2e     # Playwright
```

## 📦 Project Status — MVP v0.1.0

All 10 sprints are complete:

```
S1.1  Foundation    ✅
S1.2  Auth          ✅
S1.3  Projects      ✅
S1.4  Comments      ✅
S1.5  Notifications ✅
S1.6  i18n          ✅
S1.7  Client Portal ✅
S1.8  Marketing     ✅
S1.9  E2E Tests     ✅
S1.10 Polish        ✅
```

## 📄 Documentation

All documentation is in English in the `docs/` folder:
- `docs/PRODUCT_SPEC.md` — Product spec from original document
- `docs/decisions/` — Architecture Decision Records
- `docs/DIAGNOSTICS_CHECKPOINT.md` — Audit results

## 📜 License

MIT