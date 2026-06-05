# Approval Inbox — Deployment Guide

> **Version**: v0.1.0-mvp
> **Updated**: 2026-06-06

## Overview

This guide covers deploying the Approval Inbox MVP to production. The project consists of two Next.js apps deployed on Vercel, backed by Supabase (Postgres + Auth + Storage).

## Architecture

```
┌─────────────────────────────────────────────┐
│  Vercel                                      │
│  ┌────────────────┐  ┌────────────────┐     │
│  │  approvalinbox  │  │  app.approval  │     │
│  │  .app (web)     │  │  inbox.app     │     │
│  └───────┬────────┘  └───────┬────────┘     │
│          │                   │               │
└──────────┼───────────────────┼───────────────┘
           │                   │
           │    ┌──────────────▼──────────┐
           │    │    Supabase             │
           └────┤  - PostgreSQL (DB)      │
                │  - Auth (passwords +    │
                │    magic-link)          │
                │  - Storage (files)      │
                │  - Row Level Security   │
                └─────────────────────────┘
                          │
                ┌─────────▼──────────────┐
                │    Resend (Email)       │
                │    - Magic links        │
                │    - Notifications      │
                └────────────────────────┘
```

## Prerequisites

1. **Vercel account** — vercel.com (Hobby plan is sufficient for MVP)
2. **Supabase account** — supabase.com (Free plan: 2 projects, 500MB DB, 1GB storage)
3. **Resend account** — resend.com (Free plan: 3000 emails/month)
4. **Custom domain** (optional): `approvalinbox.app` + `app.approvalinbox.app`

## Step 1: Supabase Setup

### 1.1 Create Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Fill in:
   - **Name**: `approval-inbox`
   - **Database Password**: generate a strong password
   - **Region**: choose closest to your target audience (e.g., `North America`)
4. Wait for project creation (~2 minutes)

### 1.2 Get API Credentials

From project dashboard → **Project Settings** → **API**:

| Variable | Location |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key (keep secret!) |

### 1.3 Enable Auth Providers

1. Go to **Authentication** → **Providers**
2. **Email/Password**: Enable (default is on)
3. **Magic Link**: Under "Email" provider, make sure "Confirm email" is ON

### 1.4 Create Storage Bucket

1. Go to **Storage**
2. Click **New bucket**
3. Name: `project-files`
4. Public: **OFF** (files are private, access via signed URLs)
5. Click **Create bucket**

### 1.5 Run Database Migrations

1. Go to **SQL Editor**
2. Open a **New query**
3. Copy-paste the contents of `docs/deployment/SUPABASE_MIGRATION.sql`
4. Click **Run** (Ctrl+Enter)

## Step 2: Vercel Setup

### 2.1 Deploy Product App (`app.approvalinbox.app`)

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Set:
   - **Root Directory**: `apps/app`
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
5. Add Environment Variables (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://app.approvalinbox.app
RESEND_API_KEY=re_xxxxxxxxxxxx
```

6. Click **Deploy**

### 2.2 Deploy Marketing Site (`approvalinbox.app`)

1. Repeat the process
2. **Root Directory**: `apps/web`
3. Environment Variables: only `NEXT_PUBLIC_APP_URL` if needed

### 2.3 Configure Custom Domain

1. Go to your Vercel project → **Settings** → **Domains**
2. Add `approvalinbox.app` for the web app
3. Add `app.approvalinbox.app` for the product app
4. Follow Vercel's DNS configuration instructions for your domain provider

## Step 3: Resend Setup

1. Go to [resend.com](https://resend.com) → **Add API Key**
2. Create a key with "Sending access"
3. Add to Vercel environment variables as `RESEND_API_KEY`
4. **Verify your domain** in Resend → **Domains**
5. Add `noreply@approvalinbox.app` as a sending domain

## Step 4: Verify Deployment

### 4.1 Auth Test
1. Open `https://app.approvalinbox.app/signup`
2. Create an account with your email
3. Check email for confirmation link (if enabled)
4. Sign in

### 4.2 Project Test
1. Click **New Project**
2. Create a project named "Test"
3. Verify it appears on Dashboard

### 4.3 File Upload Test
1. Open the project
2. Drag and drop a file
3. Verify it appears in file list

### 4.4 Share & Client Portal Test
1. Go to project
2. Generate share link (API)
3. Open `/c/[token]` in incognito
4. Verify comments work

## Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Required for magic link & notifications)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Troubleshooting

| Problem | Solution |
|---|---|
| **Auth redirect loop** | Check `NEXT_PUBLIC_APP_URL` matches your deployment URL |
| **Files not uploading** | Check Storage bucket `project-files` exists and RLS policy allows insert |
| **Email not sending** | Verify Resend API key and domain verification |
| **404 on client portal** | Ensure `share_token` exists in `project_members` table |
| **i18n not working** | Check routes use `[locale]` prefix or `as-needed` config |

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on push/PR to main
- Checks TypeScript (`pnpm typecheck`)
- Runs ESLint (`pnpm lint`)
- Runs tests (`pnpm test:e2e`)

## Monitoring (Post-Deployment)

- **Vercel Analytics** — built-in, check dashboard
- **Supabase Logs** — Authentication, API, SQL query logs
- **Resend Logs** — email delivery status
- **Error Monitoring** — add Sentry or use Vercel Error Logs