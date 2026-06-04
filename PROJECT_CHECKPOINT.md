# Approval Inbox — Project Checkpoint

> **Status**: Pre-MVP / Planning complete
> **Last updated**: 2026-06-03
> **Owner**: Vitaliy
> **Target launch**: MVP Q3 2026

## 1. Product Snapshot

**Product Name**: Approval Inbox
**Mission**: Centralize client approvals and revisions into one minimal workflow for freelancers and agencies.
**Problem**: Client feedback is fragmented across Telegram, email, Slack, and voice messages. Teams lose approvals, revisions, latest file versions, and task clarity.
**Target Audience**: Freelance designers, web studios, motion designers, small creative agencies.
**Success Metric**: Reduce client feedback chaos and time spent searching for approvals.
**Positioning**: "Client approvals without chaos."

## 2. MVP Scope

### Included
1. Auth — password for freelancers, magic-link for clients (Free/Solo), invites for team (Agency)
2. Project CRUD with member management
3. File upload with drag-and-drop + progress
4. File versioning (v1 → v2 → v3 in one entity, Filestage-style)
5. Universal file viewer (images, PDF, video, audio, 3D, Office)
6. Pin-comments on images/PDF + text comments with threads
7. Single-step approval (approved/rejected/changes_requested)
8. Activity timeline (chronological event log)
9. Email notifications (magic-link, file uploaded, comment, approval) via Resend
10. In-app notification panel
11. i18n: EN (default) + RU via next-intl

### Non-Goals (MVP)
Full PM, task boards, chat, CRM, billing, Telegram/Slack integrations, AI features.

## 3. Tech Stack — Locked Decisions

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR, RSC, optimal i18n |
| UI Kit | shadcn/ui | Copy-paste, full control, Tailwind-native |
| Backend/DB | Supabase (Postgres + Auth + Storage) | Single provider, RLS out-of-the-box |
| Auth | Supabase Auth (password + magic-link) | Hybrid access model |
| File storage | Supabase Storage | 1GB free, RLS |
| Real-time | SSE via Next.js API routes | One-way push, cheap, no WebSocket infra |
| Email | Resend + React Email | 3k free, great DX |
| Analytics | PostHog | OSS, funnels + replay + feature flags |
| Monorepo | Turborepo + pnpm | Reuse UI, email, db, config |
| Testing | Vitest (unit) + Playwright (E2E) | Modern standard |
| Deploy | Vercel | Native Next.js support |
| i18n | next-intl, /[locale] routing | App Router native |
| Languages MVP | EN (default) + RU | Pragmatic, easy to extend |
| Billing | Stripe in V2 | Validate product first |
| File versioning | v1, v2, v3 in one file | Filestage-style |
| Approval | Single-step | Simplicity |
| Comments | Pin (img/PDF) + text | Killer feature for designers |

## 4. Repository Layout

- `apps/web` — Marketing site
- `apps/app` — Product app
- `packages/ui` — Shared shadcn components
- `packages/database` — Supabase client + types + migrations
- `packages/auth` — Auth logic (session, RBAC, permissions)
- `packages/realtime` — SSE client/server
- `packages/file-viewer` — Universal viewer components
- `packages/email-templates` — React Email templates
- `packages/analytics` — PostHog wrappers
- `packages/config` — Shared tsconfig/eslint/tailwind
- `docs/` — English-only documentation

## 5. Database Tables (Planned)

users, projects, project_members, files, file_versions, comments, comment_reactions, approvals, notifications, activity_logs, magic_link_tokens, invite_tokens

RLS: user-scoped, project-scoped, guest-scoped via share_token.

## 6. Roadmap

**Phase 1 — MVP (6-8 weeks)**
S1.1 Foundation → S1.2 Auth → S1.3 Projects → S1.4 Files + Storage → S1.5 File Viewer → S1.6 Comments + SSE → S1.7 Approvals → S1.8 Notifications → S1.9 Marketing → S1.10 E2E + Polish

**Phase 2 — Beta (4-6 weeks)**
Telegram bot, mobile-optimized client portal, rich notifications, Stripe billing, custom branding

**Phase 3 — AI**
Feedback summarization, AI revision tasks, conflict detection, smart notifications

## 7. Monetization (V2)

Free: 1 project, 5 files/mo, magic-link clients
Solo $9/mo: 10 projects, unlimited files, custom branding
Agency $39/mo: unlimited, team accounts, full client accounts

## 8. Completed Milestones

### Sprint 1.1 — Foundation ✅ (2026-06-03)
- [x] Initialize Turborepo + pnpm workspace
- [x] Root package.json + turbo.json + pnpm-workspace.yaml
- [x] Shared tsconfig/base.json in packages/config
- [x] apps/web — Marketing site (Next.js 16 + Tailwind + shadcn/ui)
- [x] apps/app — Product app (Next.js 16 + Tailwind + shadcn/ui)
- [x] shadcn/ui initialized in both apps
- [x] Git repository initialized
- [x] Documentation structure (docs/INDEX.md, PRODUCT_SPEC.md, decisions/)
- [x] Diagnostics checkpoint created (0 vulnerabilities, 0 errors)

### Sprint 1.2 — Authentication ✅ (2026-06-03)
- [x] Supabase packages installed (@supabase/supabase-js, @supabase/ssr)
- [x] packages/database created (browser, server, admin Supabase clients)
- [x] apps/app middleware with route protection
- [x] Auth pages: login, signup, auth/callback
- [x] Magic-link flow implemented
- [x] .env.example with all required variables
- [x] ADR 0002: Authentication Flow documented

## 9. Next Steps

1. Bootstrap Supabase project
2. Set up Vercel projects (web + app)
3. Create GitHub repo with branch protection
4. Set up Resend domain
5. Configure PostHog project
6. Begin S1.3 — Projects & Files sprint

---

**Changelog**: 2026-06-03 — Initial checkpoint from spec and decision-making session