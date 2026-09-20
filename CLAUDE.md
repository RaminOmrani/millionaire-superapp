# Millionaire Super App — CLAUDE.md

Portal that unifies every product of the Millionaire holding (Mashhad, Iran).
Landing page shows product tiles with logos → user picks one → product hub with 5 actions.
All content comes from `data.md` (Persian). Read it fully before writing any code. Never invent
prices, URLs, features or contact details — if a value is `❓` in data.md, that item is **locked**.

## Language & direction
- UI language: Persian (fa-IR), `dir="rtl"` on `<html>`, Persian digits in prices/dates.
- Talk to the user (Ramin) in Persian. Code, comments, commit messages in English.

## Stack (decided — do not re-ask)
- Next.js 15 (App Router, React 19, Server Actions), TypeScript strict.
- Tailwind CSS v4 + CSS variables for brand tokens (see data.md §2). No component library.
- `motion` (framer-motion successor) for animation. `lucide-react` for icons.
- SQLite via `better-sqlite3` + Drizzle ORM. DB file at `./data/app.db` (Docker volume).
- Auth for `/admin` only: single admin, credentials from `.env`, `iron-session` cookie.
- Logos are SVG — inline them or use `<Image>`; never rasterise. Recolour via CSS only where a mark is single-colour.
- Fonts: Vazirmatn self-hosted from `public/fonts/` (woff2), no Google Fonts (blocked for Iranian users).
- Deploy: Docker (multi-stage, standalone output) + Caddy on Ubuntu VPS. `docker compose up -d`.
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
- A locked action renders visibly (dimmed, lock glyph, tooltip «به‌زودی») — never hidden.
- Support action for every product links to `https://support.softmiliac.com` with the product preselected
  (query param; confirm the exact param name with Ramin before hardcoding).
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
- Commit after each coherent step with conventional commits (`feat:`, `fix:`, `chore:`).
- When you need a missing value, ask Ramin in Persian in one short list — do not stall on it,
  keep the item locked and continue.
- Every reply to Ramin ends with a 3-line progress overview: done / remaining / next.
- Never commit `.env`, `data/*.db`, or `node_modules`.
