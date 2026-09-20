# Millionaire Super App

Unified portal for all products of the Millionaire holding — accounting, CRM, Shop Mojahaz, Menu Club, Garson-yar.

- Spec & engineering rules: `CLAUDE.md`
- All content (products, tariffs, contacts, brand tokens): `data.md` — the only content source; `src/content/*.ts` is its typed transcription
- Logos: `public/brand/<product>/` (SVG) · source: `docs/brand-source/LOGO.ai`
- Reference screenshots of existing sites: `docs/reference/`

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · `motion` · `lucide-react` ·
SQLite (`better-sqlite3`) + Drizzle ORM · Docker + Caddy. Always on the latest stable releases.

## Develop

```bash
pnpm install
cp .env.example .env
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm build
```

Database: schema in `src/db/schema.ts`; after a change run `pnpm db:generate` and commit `drizzle/`.
Migrations are applied automatically when the app opens `DATABASE_PATH` (default `./data/app.db`).

## Deploy (Ubuntu VPS)

```bash
cp .env.example .env     # fill in real values
docker compose up -d --build
```

Caddy terminates TLS for `app.softmiliac.com` (see `Caddyfile`) and proxies to the app container.
SQLite lives in the `app-data` volume.
