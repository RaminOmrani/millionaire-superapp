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

## Routes

| Path | What |
|---|---|
| `/` | Landing — product tiles |
| `/[product]` | Product hub — 5 action cards (locked ones stay visible) |
| `/consult` | Consultation form (Server Action → zod → SQLite) |
| `/admin` | Admin: list/filter requests, change status, notes, CSV export (`/api/admin/export`) |
| `/admin/login` | Single admin, credentials from `.env`, iron-session cookie |

## Deploy (Ubuntu VPS)

```bash
git clone <repo> millionaire-superapp && cd millionaire-superapp
cp .env.example .env     # set ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET (32+ random chars)
docker compose up -d --build
docker compose logs -f app   # first start applies the SQLite migration
```

Caddy terminates TLS for `app.softmiliac.com` (see `Caddyfile`) and proxies to the app container;
the DNS A record must point at the VPS before certificates can be issued. SQLite lives in the
`app-data` volume — back it up with `docker compose cp app:/app/data/app.db ./backup.db`.

Update: `git pull && docker compose up -d --build`.

### Existing reverse proxy on the VPS

If ports 80/443 are already taken by nginx or another Caddy, skip the bundled Caddy:

```bash
docker compose -f docker-compose.external-proxy.yml up -d --build   # app on 127.0.0.1:3000
```

Then add the site to the existing proxy — `deploy/nginx-app.softmiliac.com.conf` (nginx) or
`deploy/caddy-site-block.txt` (Caddy). Both snippets use port 3100; set `APP_PORT=3100` in `.env`
(3000 is already taken on the holding's VPS). The admin cookie is `Secure`, so `/admin` login only
works over HTTPS — issue the certificate (e.g. `certbot --nginx -d app.softmiliac.com`) once DNS points here.
