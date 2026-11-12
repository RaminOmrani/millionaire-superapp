# HANDOFF — full project context for the next developer / AI agent

> Read this file once, completely, before touching anything. It is the "memory" of the project:
> what exists, why it is the way it is, how it is deployed, what is still open, and how to work with
> the owner. Keep it current: when you finish a coherent step, update §3 (state), §8 (decisions)
> and `docs/ROADMAP.md` in the same commit.
>
> Last updated: 2026-11-08 (Gregorian) — after the "Snapp-inspired extras" release.

---

## 0. Read order (≈15 minutes)

1. **`CLAUDE.md`** — engineering rules, stack, architecture, design direction. Binding for every agent
   (the name is historical; `AGENTS.md` points to it).
2. **`data.md`** (Persian) — the *only* content source. Never invent prices, URLs, features, contacts.
   A `❓` value means the related UI item stays **locked** (visible, dimmed, «به‌زودی»).
3. **This file** — state, deploy, decisions, gotchas.
4. **`docs/ROADMAP.md`** — open items (§1 locked data, §4 infrastructure). Remind the owner of them.
5. `README.md` — routes table and quick commands.

## 1. What the product is

**Millionaire Super App** (`https://app.softmiliac.com`) — one portal for every product of the
Millionaire holding (Mashhad, Iran, founded ۱۳۸۵). Five products, each with its own brand/accent:

| slug | name | status | notes |
|---|---|---|---|
| `millionaire` | نرم‌افزار حسابداری میلیونر | active | panel not ready yet → «ورود به پنل» locked |
| `crm` | CRM میلیونر | active | panel = https://crm.softmiliac.com |
| `shopmojahaz` | شاپ مجهز | active | panel = site; 4 package names, prices ❓ |
| `menuclub` | منوکلاب | active | panel = site |
| `garson` | گارسون‌یار | active | panel = https://garson.softmiliac.com; long description + 11 feature groups in products.ts |

Each product hub has a 2–3 line intro (description, `line-clamp-3`) and the actions: panel / support /
videos (millionaire, menuclub only) / pricing / AI / «امکانات و سطح‌بندی» (key `details`, links to
`/[product]/features`: full description, highlights, feature groups, tiers/plans, consult CTA). Support is always
the plain link `https://support.softmiliac.com`. AI is a teaser (locked) everywhere until content exists.

Two faces from the same code:
- **Website** (browser): hero banner, header, footer, mobile CTA bar.
- **Installed app** (PWA standalone, or `?app=1` to test, `?app=0` to clear): compact header, floating
  glass tab bar with raised search, no hero/footer. Switched by `data-app="1"` on `<html>` + Tailwind
  `app:` variant only (no JS branching — avoids flashes).

## 2. The owner and how to work with him

- **Ramin** (GitHub `RaminOmrani`) — owner/decision-maker, not a full-time developer. Talk to him in
  **Persian**, plainly. Code, comments, commit messages in **English**.
- Always say **where** a command must run: "on the VPS" vs "on your PC" vs "nothing for you to do".
  Give copy-pasteable one-liners.
- He rejects plain/default-looking UI. He iterates visually with screenshots (often of Snapp, the
  Iranian super-app) — take the idea, keep our own identity, never copy Snapp's look/brand.
- He prefers decisions made for him ("هر تصمیمی میگیری اوکیه") — decide sensibly, document it here.
  Only ask about *missing facts* (prices, URLs…), in one short Persian list, and keep going meanwhile.
- **Never ask for or echo secrets in chat.** If he pastes `.env` values or screenshots with secrets,
  tell him to rotate them (this already happened once with `SESSION_SECRET` — see ROADMAP §4).
- Every reply ends with a 3-line overview (done / remaining / next) and reminds him of ROADMAP §1/§4.

## 3. Current state (2026-11-11)

- **Live:** https://app.softmiliac.com (HTTPS via certbot), admin at `/admin`.
- **Git:** `main` is the stable, complete branch (PR #1 merged everything on 2026-11-08). Work happens
  on a feature branch (so far `claude/busy-feynman-nyyk6i`), goes to `main` through a PR, and the VPS
  deploys from `main`. CI (lint + typecheck + build) runs on every push and PR (`.github/workflows/ci.yml`).
- **Repo visibility:** currently **public** (owner's choice to simplify `git pull` on the VPS).
  Therefore: no secrets, tokens, passwords or private customer data in any committed file.
- **Done:** phases 1–5 + super-app launcher, app mode, banners CMS, side menu with news, recently
  viewed, icon badges, admin CMS for product content and pricing plans, stats, password change,
  e-mail notification (needs SMTP), SEO/OG, PWA + offline page, backups script.
  Designer pass (2026-11-11): features & tiers page per product (`/[product]/features`), «ویدیوهای آموزشی»
  action, short intro above the hub actions, fixed top banner + sliding middle banner (house slides per
  surface), admin-editable «باشگاه مشتریان» band, repaired PWA/apple icons + `favicon-32.png`,
  white service icons in dark mode.
- **Not done / waiting:** see `docs/ROADMAP.md`.

## 4. Production / infrastructure

| item | value |
|---|---|
| host | Ubuntu VPS (ParsPack, Stockholm), IP in `data.md` §6, logged in as `root` |
| checkout | `~/millionaire-superapp` (= `/root/millionaire-superapp`), should track `main` (it was cloned on the work branch; switch with `git fetch origin && git checkout main`) |
| run | `docker compose -f docker-compose.external-proxy.yml up -d --build` |
| app port | container 3000 → host `127.0.0.1:3100` (`APP_PORT=3100`; host port 3000 is another site) |
| reverse proxy | the VPS's existing **nginx** (other vhosts: support.softmiliac.com, clinic, telkap, aiassist) — vhost file `deploy/nginx-app.softmiliac.com.conf`, TLS by `certbot --nginx` |
| neighbours | container `millionaire-support` on 127.0.0.1:4000 (support site, separate repo) — don't touch |
| data | Docker volume `app-data` → `/app/data/app.db` (SQLite, WAL) + `/app/data/uploads/banners/*` |
| update | on the VPS: `cd ~/millionaire-superapp && git pull && bash deploy/update.sh` (backs up first, rebuilds, prints HTTP status) |
| backup | `deploy/backup.sh` → `~/superapp-backups/` (keeps 14), pipes `deploy/sqlite-backup.cjs` into `node -` inside the container (standalone output keeps `better-sqlite3` only under `node_modules/.pnpm/`, so a bare `require` fails — fixed 2026-11-12; before that no backup had ever succeeded). Cron line is in the script header; **not yet installed** (ROADMAP §4) |
| deploy key | an SSH key exists at `~/.ssh/superapp` on the VPS, intended for when the repo goes private again |
| bundled Caddy | `docker-compose.yml` + `Caddyfile` are only for a clean host with free 80/443 — not used in prod |

**`.env` on the VPS** (names only — values never leave the server): `DATABASE_PATH`, `ADMIN_USERNAME`,
`ADMIN_PASSWORD` (quote with `'…'` if it contains `$` or `#`), `SESSION_SECRET` (≥32 chars,
`openssl rand -hex 32`), `APP_PORT=3100`, `NEXT_PUBLIC_SITE_URL`, optional `SMTP_*`. Template: `.env.example`.
Once the admin saves a new password in `/admin/settings`, a scrypt hash in table `settings`
overrides `ADMIN_PASSWORD`.

## 5. Code map — where things live and how data flows

```
data.md ──(hand transcription)──▶ src/content/products.ts, holding.ts   (baseline, typed)
                                         │
              table product_content ─────┤  admin overrides (status, texts, links, plans, badge…)
                                         ▼
                             src/content/resolve.ts  getResolvedProducts()
                                         ▼
                 public pages (force-dynamic): (site)/page.tsx, (site)/[product]/page.tsx …
```

- `src/content/` — `products.ts` (types + 5 products, `AI_TEASER`), `holding.ts` (company facts,
  socials, logos), `resolve.ts`, `banners.ts` (`getTopBanners` fixed / `getMiddleBanners` slider, house fallbacks, themes),
  `search-index.ts` (launcher search), `labels.ts`.
- `src/db/` — `schema.ts` tables: `consult_requests`, `product_content`, `settings`,
  `login_attempts`, `banners`. `client.ts` opens SQLite lazily and **applies `drizzle/` migrations on
  first open**; `src/instrumentation.ts` opens it at server start.
- `src/lib/` — `auth.ts` (admin credentials, scrypt), `session.ts` (iron-session), `rate-limit.ts`
  (login + consult form), `validation.ts` (zod), `persian-digits.ts`, `format.ts`, `mail.ts`
  (nodemailer, optional), `uploads.ts` (banner images; raster only, magic bytes, 1.5 MB),
  `local-store.ts` (per-device localStorage via `useSyncExternalStore`), `search.ts`.
- `src/proxy.ts` — Next 16 "proxy" (ex-middleware) guarding `/admin/*` and `/api/admin/*`.
- `src/app/(site)/` — public pages: `/`, `/[product]`, `/consult` (+ `actions.ts` Server Action),
  `/about`, `/offline`, branded 404. `src/app/admin/` — dashboard (requests), `products`, `banners`,
  `stats`, `settings`, `login`, `requests/[id]`; server actions in `actions.ts`, `banner-actions.ts`.
- `src/app/api/` — `admin/export` (CSV), `news` (titled live banners for the side menu, `no-store`).
  `src/app/media/banners/[file]` serves uploads. `sitemap.ts`, `robots.ts`, `manifest.ts`.
- `src/components/brand/` — Launcher (search + icon grid), BannerCarousel, AppTabBar, SideMenu,
  HeaderShell/SiteHeader/SiteFooter, HoldingLogo, ServiceIcon, SocialLinks, InstallPrompt,
  MobileCtaBar, HeroVisual, ServiceWorker. `product/` — ProductGrid, ProductTile, ActionCard,
  PricingPlans (shared plan cards), ConsultForm, RecordVisit. `admin/` — forms/editors. `ui/` — Field, MapButton, ThemeToggle.
- `public/brand/<product>/*.svg` logo packs (which file where: `data.md` §2), `public/brand/icons/`
  service icons, `public/fonts/` Vazirmatn, `public/icons/` + `public/og/` PNGs, `public/sw.js`.
- `docs/brand-source/LOGO.ai` original artwork; `docs/reference/*.png` screenshots of the existing
  sites (inspiration only).

## 6. Run & verify locally

```bash
pnpm install
cp .env.example .env            # dev values are fine locally
pnpm dev                        # http://localhost:3000 ; app mode: http://localhost:3000/?app=1
pnpm lint && pnpm typecheck && pnpm build   # must all pass before any push
```
- Admin locally: `/admin/login` with `.env` credentials. The cookie is `Secure` in production, so in
  prod login only works over HTTPS.
- Visual checks: Playwright (`require('playwright')`, chromium) — screenshot phone (390px) and
  desktop (1440px), dark + light, website + `?app=1`. Ramin judges by screenshots.
- Schema change: edit `src/db/schema.ts` → `pnpm db:generate` → commit `drizzle/` (applied
  automatically on next start; there are migrations 0000–0003 so far).

## 7. Gotchas (learned the hard way)

- **Versions:** TypeScript is pinned to 6 and ESLint to 9 on purpose (TS 7 breaks typescript-eslint,
  `eslint-config-next` doesn't support ESLint 10). Everything else: latest stable, bump freely.
- **`next lint` is gone** in Next 16 → `pnpm lint` = `eslint .` (flat config).
- **React-hooks lint rules are strict** (set-state-in-effect, purity, refs-in-render): use
  `useSyncExternalStore` for browser state, keep `Date.now()`/random out of render, use
  `style.setProperty` instead of mutating objects.
- **Never edit `products.ts` to reflect admin changes** — it's the data.md baseline; the panel writes
  to `product_content`.
- **App vs website:** style with `app:` / `light:` variants only; never branch rendering in JS.
- **Service worker:** network-first for pages, cache-first for static. Bump `VERSION` in `public/sw.js`
  when precached files change.
- **Logos:** SVG only in UI (never rasterise; no live `<text>` in SVGs — all outlined). PNGs only for
  PWA icons/OG, rendered with a throwaway Playwright script (not in repo); `icon-192.png` and
  `apple-touch-icon.png` are downscaled from `icon-512.png` (sharp, lanczos3), `favicon-32.png` from `mark.svg`.
- **Admin links:** every admin-entered href goes through `isSafeHref` (`src/lib/safe-href.ts`): http(s) or an
  internal `/path`, never `//host`; renderers treat a link as internal only via `isInternalHref`.
- **No external runtime services** (no Google Fonts, CDN, analytics, Vercel) — users are in Iran.
- **Uploads & DB are not in git** (`data/*.db`, `data/uploads/`, `.env` are git-ignored). Never commit
  test uploads.
- **Persian digits** for prices/dates; avoid a middle dot `·` right next to Persian digits (renders badly).
- **`coming_soon` ≠ closed:** tile opens the hub with a clock «به‌زودی» badge; only unavailable actions lock.
- **Icon badges** on the launcher come only from the admin (`product_content.badge`); no defaults.

## 8. Decision log (why things are the way they are)

| when | decision | by |
|---|---|---|
| phase 1 | Next.js 16 / React 19 / TS strict / Tailwind v4 / SQLite+Drizzle / Docker; "always latest stable" | Ramin |
| phase 1 | Font: Vazirmatn self-hosted (IRANSans is commercial, no files) | Claude, OK'd |
| phase 1 | Support link has no query param — users pick company/section on the support site | Ramin |
| phase 1 | Shop Mojahaz / Menu Club / CRM "panel" = their site URL; accounting panel not ready | Ramin |
| deploy | VPS already runs nginx on 80/443 → app on 127.0.0.1:3100 behind existing nginx + certbot; Caddy not used | Claude, after checking the VPS |
| deploy | Repo made **public** to avoid auth hassle for `git pull` (re-privatise later with deploy key) | Ramin |
| deploy | DB opened at server start (instrumentation) so backup works before the first request | Claude |
| phase 3 | Admin CMS layered over products.ts (`product_content`), pricing plans editor, stats, password change, SMTP mail | Ramin asked for "2 & 3" |
| super-app | Search-first launcher like Snapp (search bar → icon grid → rest), keep own skeleton | Ramin |
| super-app | Website and installed app look different (app mode via `data-app`) | Ramin |
| banners | Two slots like Snapp: slim top (under search) + large middle; admin-managed; house banner when empty | Ramin |
| banner behaviour | Top slot = one fixed banner (no rotation); middle = auto slider. House: top = consult CTA, middle = +۵۰۰۰ & Garson-yar. Marks straight, no shadow | Ramin + designer, 2026-11-11 |
| design pass | 27-point list: lighter dark bg `#18181d`, link button top-left, logo before text, «درباره ما», info card last, unified contact rows, dark logos added, Garson active | Ramin |
| grid | Products + 3 services (support, consult, about) as a compact 2-col (phone) / 4-col (desktop) grid | Ramin |
| nav | Floating glass tab bar with raised search; side menu with «تازه‌ها» + red dot; «اخیراً» row; admin icon badges | Ramin OK'd Claude's Snapp-inspired proposals |
| content | Garson-yar active, panel https://garson.softmiliac.com; Instagram `softmilliac` (double l) confirmed | Ramin |
| content | AI action: one short teaser line ("from analysis and reports to forecasting"), details ❓ | Ramin |
| hub | Inline «اطلاعات و جزئیات» replaced by a features & tiers page per product (`/[product]/features`, key `details` kept for DB rows); short intro above «دسترسی‌ها»; new «ویدیوهای آموزشی» action (millionaire → Aparat channel, menuclub locked until its link is given) | Ramin + designer, 2026-11-11 |
| icons | Service icons (support / consult / about) white in dark mode, brand red in light; PWA 192/180 PNGs re-made from icon-512 (old ones were broken), `favicon-32.png` added (SW `VERSION` v2) | designer feedback, 2026-11-11 |
| landing | «باشگاه مشتریان» band after the products grid (both modes): all copy from `/admin/settings` (settings keys `club_title` / `club_text` / `club_href`, no migration); empty text = hidden; link only http(s) or internal `/path` | designer suggestion, 2026-11-11 |

## 9. Next steps for whoever continues

1. Read ROADMAP §1 and ask Ramin (Persian, one list) for whatever is still `❓`.
2. ROADMAP §4: install backup cron, move the VPS checkout to `main`, re-privatise the repo
   with the deploy key, rotate `SESSION_SECRET`, configure SMTP.
3. New features: propose first (Ramin likes concrete, visual proposals), implement in small commits,
   screenshot, then give him the exact VPS update command.
