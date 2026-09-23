# Millionaire Super App — CLAUDE.md

Portal that unifies every product of the Millionaire holding (Mashhad, Iran).
Landing page shows product tiles with logos → user picks one → product hub with 5 actions.
All content comes from `data.md` (Persian). Read it fully before writing any code. Never invent
prices, URLs, features or contact details — if a value is `❓` in data.md, that item is **locked**.

## Language & direction
- UI language: Persian (fa-IR), `dir="rtl"` on `<html>`, Persian digits in prices/dates.
- Talk to the user (Ramin) in Persian. Code, comments, commit messages in English.

## Stack (decided — do not re-ask)
- Always the **latest stable** of every package (Ramin's rule); bump freely and update this file.
  Current: Next.js 16 (App Router, Turbopack, React 19, Server Actions), TypeScript 6 strict
  (TS 7 is blocked by typescript-eslint; ESLint 9 is the newest `eslint-config-next` supports).
- Tailwind CSS v4 + CSS variables for brand tokens (see data.md §2). No component library.
- `motion` v13 (`motion/react`) for animation. `lucide-react` for icons.
- SQLite via `better-sqlite3` + Drizzle ORM. DB file at `./data/app.db` (Docker volume).
- Auth for `/admin` only: single admin, username from `.env`; password from `.env` unless a scrypt hash was saved
  from /admin/settings (table `settings`, key `password_hash`). `iron-session` cookie, `proxy.ts` guard, login throttling.
- Logos are SVG — inline them or use `<Image>`; never rasterise in the UI. Recolour via CSS only where a mark is single-colour.
  Exception: `public/icons/*.png` (PWA/apple icons) and `public/og/*.png` (Open Graph) are rendered from the SVGs
  with Playwright (scratch script, not in repo) because those consumers need PNG.
- Fonts: Vazirmatn variable woff2 self-hosted from `public/fonts/` (`@font-face` in globals.css), no Google Fonts (blocked for Iranian users).
- Deploy: Docker (multi-stage, standalone output) on the holding's Ubuntu VPS. That VPS already runs nginx
  on 80/443, so production uses `docker compose -f docker-compose.external-proxy.yml up -d --build`
  (app on 127.0.0.1:3100, nginx vhost from `deploy/`, certbot). The bundled Caddy compose is for a clean host.
- Zero external SaaS at runtime (no Vercel, no analytics, no CDN) — users are in Iran.

## Architecture
```
src/
  app/
    (site)/page.tsx            landing — product grid
    (site)/[product]/page.tsx  product hub — 5 action cards
    (site)/consult/page.tsx    consultation form + contact
    admin/...                  protected admin panel
    api/...                    only if a route handler is unavoidable
  components/                  ui/ (primitives), brand/, product/, admin/
  content/products.ts          typed content parsed from data.md — single source of truth
  db/                          drizzle schema + client
  lib/                         utils, validation (zod), persian-digits
public/brand/<product>/        SVG logo pack (which file to use where: data.md §2)
public/fonts/
docs/reference/                site screenshots (design inspiration only)
```
- Product content lives in `src/content/products.ts` as a typed array. Each product has
  `status: 'active' | 'coming_soon'` and each action has `enabled: boolean` + `href` or `content`.
- Admin overrides (table `product_content`) are layered on top by `src/content/resolve.ts`
  (`getResolvedProducts()`); public pages read the resolved data and are `force-dynamic`.
  products.ts stays the data.md baseline — never edit it to reflect panel changes.
- A locked action renders visibly (dimmed, lock glyph, tooltip «به‌زودی») — never hidden.
- A `coming_soon` product is «not launched yet», not closed: its tile/icon open the hub (intro page) with a
  clock «به‌زودی» badge; only its unavailable actions carry the lock.
- Website vs installed app (PWA): the boot script in `app/layout.tsx` sets `data-app="1"` on `<html>` in
  standalone mode (or with `?app=1` for testing, `?app=0` to clear). Style differences with the Tailwind
  `app:` variant only (e.g. `app:hidden`, `hidden app:block`) — never branch in JS render, to avoid flashes.
  App mode: compact header, bottom tab bar (`AppTabBar`), no hero banner/footer/mobile CTA bar.
- Promo banners (table `banners`, `/admin/banners`): slots `top` (between search and icons) and `middle`;
  audience both/web/app; optional date window; uploaded images live in `<data dir>/uploads/banners`
  and are served by `/media/banners/[file]` (raster only, magic-byte checked, 1.5 MB). No banner → no slot.
- `public/sw.js`: network-first for pages (never serves stale content), cache-first for fonts/brand/_next/static,
  `/offline` fallback. Bump `VERSION` when changing precached files.
- Support action for every product is a plain link to `https://support.softmiliac.com` (no query param —
  the user picks the company and section on the support site itself; decided by Ramin).
- Consultation form: Server Action → zod validation → insert into `consult_requests` → success state.
  Admin lists requests, changes status (new / contacted / closed), adds notes, exports CSV.

## Design direction (important — Ramin rejects plain/default-looking UI)
- Bold, editorial, premium. Think fintech brand site, not admin dashboard.
- Dark-first landing: near-black `--brand-dark`, large Persian display type (Vazirmatn 900),
  product tiles as oversized cards with the product's accent colour bleeding into the background,
  logo large and crisp, hover/press micro-interactions with `motion`.
- Each product hub inherits the product accent for its whole page (CSS variable swap), so the
  five hubs feel like five distinct brands under one roof.
- Asymmetric layouts, generous whitespace, subtle grain/gradient textures, no stock-template card grids
  with identical borders. No emoji in UI. No default Tailwind blue/gray palettes.
- Light mode for admin only (utility surface); public site is dark with a light toggle.
- Fully responsive; landing must look intentional on mobile (single column, tiles become full-bleed).
- Accessibility: focus rings, `aria-disabled` on locked actions, contrast ≥ 4.5:1.

## Working rules
- Work in small verifiable steps; run `pnpm lint && pnpm typecheck && pnpm build` before claiming done.
- `next lint` no longer exists (Next 16): `pnpm lint` runs `eslint .` with the flat config in `eslint.config.mjs`.
- DB migrations: edit `src/db/schema.ts` → `pnpm db:generate` → commit `drizzle/`. The client applies them on first open.
- Commit after each coherent step with conventional commits (`feat:`, `fix:`, `chore:`).
- When you need a missing value, ask Ramin in Persian in one short list — do not stall on it,
  keep the item locked and continue.
- Every reply to Ramin ends with a 3-line progress overview: done / remaining / next, and reminds him of the
  open items in `docs/ROADMAP.md` §1 (locked data) and §4 (infrastructure) when relevant.
- Never commit `.env`, `data/*.db`, or `node_modules`.
