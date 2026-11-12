#!/usr/bin/env bash
# One-line update on the holding VPS: pull, rebuild, restart, keep a DB backup first.
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.external-proxy.yml"
PORT="$(grep -E '^APP_PORT=' .env 2>/dev/null | cut -d= -f2 || true)"
PORT="${PORT:-3100}"
# Show the backup's own error instead of hiding it (first deploy: no container/DB yet).
bash deploy/backup.sh || echo "⚠ backup did not run (see the message above) — continuing"
git pull --ff-only
$COMPOSE up -d --build
$COMPOSE ps
# The container needs a few seconds to boot: wait up to 60s for an answer.
for _ in $(seq 1 30); do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/" 2>/dev/null || true)"
  [ "$code" = "200" ] && break
  sleep 2
done
echo "app → HTTP ${code:-000}"
[ "${code:-000}" = "200" ] || { echo "⚠ app is not answering yet — check: $COMPOSE logs --tail 50 app"; exit 1; }
