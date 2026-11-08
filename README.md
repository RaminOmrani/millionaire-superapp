# Millionaire Super App

Unified portal for all products of the Millionaire holding — accounting, CRM, Shop Mojahaz, Menu Club, Garson-yar.

- **New here (human or AI)? Start with `AGENTS.md` → `docs/HANDOFF.md`** (state, deploy, decisions, gotchas)
- Spec & engineering rules: `CLAUDE.md`
- Open items: `docs/ROADMAP.md`
- All content (products, tariffs, contacts, brand tokens): `data.md` — the only content source; `src/content/*.ts` is its typed transcription
- Logos: `public/brand/<product>/` (SVG) · source: `docs/brand-source/LOGO.ai`
- Reference screenshots of existing sites: `docs/reference/`

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · `motion` · `lucide-react` ·
SQLite (`better-sqlite3`) + Drizzle ORM · Docker behind the VPS's nginx. Always on the latest stable releases.

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
| `/about` | Holding info (locked fields shown as «به‌زودی») |
| `/admin` | Requests: search, filters, pagination, bulk status, CSV export (`/api/admin/export`) |
| `/admin/products` | Content management: status, description, features, per-action links, pricing plans |
| `/admin/banners` | Promo banners: text or image, top/middle slot, web/app/both, date window, live preview |
| `/admin/stats` | Counts, 30-day chart, per-product breakdown, login log |
| `/admin/settings` | Change admin password, notification e-mail (needs `SMTP_*`) |
| `/admin/login` | Single admin, iron-session cookie, throttled after 5 failures |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js`, `/offline` | SEO + installable PWA (app mode: `?app=1`) |

## Deploy (Ubuntu VPS)

Production runs on the holding's VPS behind its existing nginx (details: `docs/HANDOFF.md` §4).

```bash
# first time
git clone <repo> ~/millionaire-superapp && cd ~/millionaire-superapp
cp .env.example .env     # set ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET (openssl rand -hex 32), APP_PORT=3100
docker compose -f docker-compose.external-proxy.yml up -d --build    # app on 127.0.0.1:3100
# nginx vhost: deploy/nginx-app.softmiliac.com.conf → sites-enabled, nginx -t, reload, certbot --nginx -d app.softmiliac.com

# every update
cd ~/millionaire-superapp && git pull && bash deploy/update.sh       # backs up, rebuilds, prints HTTP status
```

Backups: `deploy/backup.sh` (SQLite + uploaded banners → `~/superapp-backups`, keeps 14; cron line in its header).
The admin cookie is `Secure`, so `/admin` login only works over HTTPS.

### Clean host (ports 80/443 free)

`docker compose up -d --build` uses the bundled Caddy (`Caddyfile`) to terminate TLS itself;
`deploy/caddy-site-block.txt` is the snippet for a host that already runs Caddy.
