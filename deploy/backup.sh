#!/usr/bin/env bash
# Daily SQLite backup on the VPS. Keeps the newest $KEEP files.
# Install once:  (crontab -l 2>/dev/null; echo "30 3 * * * /root/millionaire-superapp/deploy/backup.sh >> /var/log/superapp-backup.log 2>&1") | crontab -
set -euo pipefail
cd "$(dirname "$0")/.."
KEEP="${KEEP:-14}"
DEST="${DEST:-$HOME/superapp-backups}"
mkdir -p "$DEST"
docker compose -f docker-compose.external-proxy.yml exec -T app sh -c \
  'cd /app/data && node -e "const D=require(\"better-sqlite3\");new D(\"app.db\",{readonly:true}).backup(\"/tmp/backup.db\").then(()=>process.exit(0))"' \
  && docker compose -f docker-compose.external-proxy.yml cp app:/tmp/backup.db "$DEST/app-$(date +%F-%H%M).db"
ls -1t "$DEST"/app-*.db | tail -n +$((KEEP + 1)) | xargs -r rm -f
echo "$(date -Is) backup ok → $(ls -1t "$DEST"/app-*.db | head -1)"
