#!/usr/bin/env bash
# One-line update on the holding VPS: pull, rebuild, restart, keep a DB backup first.
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.external-proxy.yml"
mkdir -p backups
$COMPOSE cp app:/app/data/app.db "backups/app-$(date +%F-%H%M).db" 2>/dev/null || echo "no DB yet, skipping backup"
git pull --ff-only
$COMPOSE up -d --build
$COMPOSE ps
curl -sS -o /dev/null -w "app → HTTP %{http_code}\n" "http://127.0.0.1:${APP_PORT:-3100}/"
