# AGENTS.md — start here (any AI agent or developer)

This repository is the **Millionaire Super App** (https://app.softmiliac.com), a Next.js 16 portal for
the products of the Millionaire holding. The rules are tool-agnostic; they were first written for
Claude Code, hence the file name `CLAUDE.md`.

**Before writing any code, read in this order:**

1. [`CLAUDE.md`](CLAUDE.md) — binding engineering rules, stack, architecture, design direction.
2. [`data.md`](data.md) — the only content source (Persian). Never invent data; `❓` = locked item.
3. [`docs/HANDOFF.md`](docs/HANDOFF.md) — current state, production deploy, code map, decision log, gotchas.
4. [`docs/ROADMAP.md`](docs/ROADMAP.md) — open items to finish or remind the owner about.

**Non-negotiables (summary — details in CLAUDE.md):**

- Talk to the owner (Ramin) in Persian; code, comments and commits in English (conventional commits).
- `pnpm lint && pnpm typecheck && pnpm build` must pass before every push.
- Never commit `.env`, `data/*.db`, `data/uploads/`, `node_modules`, or any secret — the repo is public.
- No external runtime services (CDN, Google Fonts, analytics) — users are in Iran.
- Public pages read `getResolvedProducts()`; never edit `src/content/products.ts` to mirror admin changes.
- Website vs installed app differ via the Tailwind `app:` variant only.
- Production update (on the VPS): `cd ~/millionaire-superapp && git pull && bash deploy/update.sh`.
- When you finish a step, update `docs/HANDOFF.md` §3/§8 and `docs/ROADMAP.md` in the same commit.
