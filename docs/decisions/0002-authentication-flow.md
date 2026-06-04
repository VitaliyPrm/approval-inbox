# ADR 0002: Authentication Flow

**Status**: Accepted
**Date**: 2026-06-03

## Context

The product requires a hybrid authentication model:
- **Freelancers / agency owners**: Traditional email + password login
- **Clients on Free/Solo tier**: Magic-link only (no password, no registration)
- **Agency tier clients**: Full account with password

Additionally, the system needs:
- Project invitation flow (owner invites reviewer or client)
- Session management via HTTP-only cookies
- Route protection (dashboard, settings, etc.)
- Client portal access via share tokens

## Decision

### Chosen approach

1. **Supabase Auth** as the identity provider
   - Handles password hashing, session management, email verification
   - Native support for both password login and magic-link (OTP)
   - Built-in RLS integration for database security

2. **`@supabase/ssr`** for Next.js 16 App Router integration
   - HTTP-only cookie-based sessions for server-side auth
   - `createServerClient` for middleware and server components
   - `createBrowserClient` for client components

3. **Middleware-based route protection**
   - Single `middleware.ts` in `apps/app`
   - Protected routes: `/dashboard/*`, `/projects/*`, `/settings/*`, `/notifications/*`
   - Public routes: `/login`, `/signup`, `/auth/*`, `/c/*`
   - Redirects unauthenticated users to `/login` with `?redirect=` parameter

4. **Client portal access** via share tokens
   - Clients receive magic-link email with project-specific `share_token`
   - Guest session created via Supabase `signInWithOtp`
   - CSRF-safe via one-time use token

### Rejected alternatives

- **NextAuth.js / Auth.js**: More complex to set up magic-link flow; Supabase Auth is simpler for our hybrid model
- **Clerk**: Paid per user; overkill for MVP; hard to customize client portal UX
- **Custom JWT**: Unnecessary; Supabase Auth handles this securely

## Consequences

- Freelancers/owners must verify email (Supabase handles this via `emailRedirectTo`)
- Magic-link clients have no password — they authenticate each session via email
- Invitations require `project_members` record with `guest_email` before sending magic-link
- Session cookies are HTTP-only and secure, preventing XSS-based session theft
- Middleware runs on every request to protected routes — minimal overhead via `config.matcher`

## Implementation

- `packages/database/` — Three Supabase clients: browser, server, admin
- `apps/app/src/middleware.ts` — Route protection logic
- `apps/app/src/app/(auth)/login/auth-form.tsx` — Shared auth form component
- `apps/app/src/app/(auth)/login/page.tsx` — Login page
- `apps/app/src/app/(auth)/signup/page.tsx` — Signup page
- `apps/app/src/app/(auth)/auth/callback/route.ts` — OAuth/code exchange handler