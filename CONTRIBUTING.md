# Contributing to VFuture

VFuture is a private, proprietary repository owned by Veltrix Media Group. Contributions are limited to authorized employees, approved contractors, and partners working under an active agreement.

By contributing, you acknowledge the confidentiality and license obligations described in [LICENSE](LICENSE).

## Who may contribute

Authorized contributors include:

- Veltrix Media Group team members
- approved contractors with repository access
- licensed or delegated partners working within the scope of a signed agreement

You must not contribute, review, copy, or redistribute material from this repository if you are not explicitly authorized to do so.

## Contribution workflow

1. Sync from the latest protected branch before starting work.
2. Create a focused branch from `main`.
3. Make the smallest change that fully solves the issue.
4. Run the required verification commands locally.
5. Update documentation, schema files, or environment references when your change affects them.
6. Open a pull request with enough context for review.
7. Merge only after review approval and successful checks.

## Local development baseline

Before opening a pull request, make sure you can:

- install dependencies with `npm install`
- configure `.env.local`
- apply `supabase/schema.sql` to a working Supabase project
- run the application with `npm run dev`
- pass the required verification commands

Recommended local toolchain:

- Node.js 20 LTS or newer
- npm 10 or newer

## Branch naming

Use short, descriptive branch names with one of the following prefixes:

- `feature/<short-description>`
- `fix/<short-description>`
- `hotfix/<short-description>`
- `refactor/<short-description>`
- `docs/<short-description>`
- `chore/<short-description>`

Examples:

- `feature/admin-stream-sync`
- `fix/news-slug-validation`
- `docs/readme-refresh`

## Commit message format

Use concise, imperative commit messages:

```text
<type>: <summary>
```

Preferred types:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `perf`

Examples:

```text
feat: add admin stream status sync endpoint
fix: sanitize gallery tags before persistence
docs: document Supabase bootstrap workflow
```

## Engineering standards

### General standards

- Follow the current Next.js App Router structure and existing project conventions.
- Keep TypeScript strictness intact; do not weaken compiler settings to land a change.
- Prefer shared utilities and domain services over duplicating logic across pages or route handlers.
- Keep public and admin behavior aligned with the existing role model: `editor`, `admin`, `senior_admin`.
- Avoid dead code, placeholder branches, and commented-out production logic.

### API and backend standards

For new or modified route handlers:

- validate payloads with Zod
- apply rate limiting where the endpoint is user- or admin-facing
- enforce role-aware auth for admin endpoints
- sanitize user-provided strings or rich text before persistence
- log security-sensitive or admin-affecting actions when appropriate

### Data and schema standards

If your change affects persisted data:

- update [`supabase/schema.sql`](supabase/schema.sql)
- update [`supabase/seed-data.sql`](supabase/seed-data.sql) if seed behavior changes
- document new environment variables in `README.md`
- document operational changes in the relevant guide if deployment steps change

Remember that not all modules have first-class tables. Invitations and streams are currently stored as settings-backed JSON values, so changes in those areas should preserve backward compatibility or include a clear migration plan.

### Frontend standards

- Reuse shared UI primitives under `src/components/ui` where possible.
- Preserve both desktop and mobile behavior.
- If you change public navigation or public route structure, review `sitemap.ts`, `robots.ts`, metadata, and localized route aliases.
- If you modify rich text rendering or media handling, verify both editor and viewer behavior.

## Verification requirements

Every pull request must, at minimum, pass:

```bash
npm run lint
npm run typecheck
npm run build
```

Important note:

- The repository does not currently ship a dedicated automated unit/integration test suite. Do not claim broader automated test coverage unless you actually added and ran it.

When your change touches auth, Supabase, storage, email, stream sync, or middleware behavior, include manual smoke-test notes in the pull request description.

## Pull request expectations

Every pull request should include:

- a clear title
- a concise summary of what changed and why
- screenshots or recordings for user-facing UI changes
- verification results
- notes about schema, env, deployment, or operational impact
- follow-up items if the work is intentionally partial

Prefer small, reviewable pull requests over large mixed-purpose changes.

## Definition of done

A change is not complete until all of the following are true:

- the implementation is finished
- verification has been run and recorded
- documentation has been updated if needed
- schema or environment changes are documented
- no secrets, build artifacts, or local environment files are committed

## Secrets and security

Do not commit or expose:

- `.env.local`
- private API keys
- Supabase service-role keys
- credentials, tokens, or exported user data

If you add a new environment variable:

- update `.env.example` when appropriate
- document it in `README.md`
- describe whether it is required, optional, server-only, or public

Report suspected vulnerabilities privately. Do not open public issues for security-sensitive details.

Security contact:

- `security@veltrixmediagroup.com`

General repository or licensing contact:

- `contact@veltrixmediagroup.com`

## Confidentiality

This repository contains confidential business and technical material. By contributing, you agree to:

- keep source code and internal documentation confidential
- avoid sharing screenshots, snippets, or implementation details outside authorized channels
- protect local copies of the repository and any generated credentials
- report accidental exposure immediately

## Unauthorized access

If you believe you have obtained access in error:

1. Stop using the repository immediately.
2. Do not copy, clone, archive, or share any files.
3. Notify `security@veltrixmediagroup.com`.
4. Remove any unauthorized local copies unless legal retention is required.

Unauthorized access or redistribution may result in access revocation, contractual remedies, or legal action.

## License reminder

Contributions are made to a proprietary codebase and do not convert the project into open-source software. Ownership, use rights, and redistribution remain governed by [LICENSE](LICENSE) and any applicable agreements with Veltrix Media Group.

Last updated: March 28, 2026
