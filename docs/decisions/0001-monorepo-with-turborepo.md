# ADR 0001: Monorepo with Turborepo

**Status**: Accepted
**Date**: 2026-06-03
**Context**: The project has multiple deployable apps (marketing site, product app) and shared packages (UI, database client, auth logic, email templates, real-time helpers). A monorepo allows code reuse, consistent tooling, and unified CI/CD.

**Decision**: Use Turborepo with pnpm workspaces.

**Consequences**:
- Shared configs (TypeScript, ESLint, Tailwind) live in `packages/config`
- All packages can be imported via workspace protocol e.g. `@approval-inbox/database`
- CI pipeline uses `turbo run lint test build` for parallel execution
- Vercel automatically detects the app to deploy based on changed files