// Runs INSIDE the app container (piped to `node -` by deploy/backup.sh).
// Next's standalone output keeps better-sqlite3 only under node_modules/.pnpm/, so a plain
// require("better-sqlite3") fails there; locate the package explicitly.
const fs = require("node:fs");
const path = require("node:path");
const root = process.env.APP_ROOT || "/app";
const db = process.env.DB_FILE || path.join(root, "data/app.db");
const out = process.env.OUT_FILE || "/tmp/backup.db";

function load() {
  try {
    return require(require.resolve("better-sqlite3", { paths: [root] }));
  } catch {
    const pnpm = path.join(root, "node_modules/.pnpm");
    const dir = fs.readdirSync(pnpm).find((n) => n.startsWith("better-sqlite3@"));
    if (!dir) throw new Error(`better-sqlite3 not found under ${pnpm}`);
    return require(path.join(pnpm, dir, "node_modules/better-sqlite3"));
  }
}

if (!fs.existsSync(db)) {
  console.error(`no database at ${db}`);
  process.exit(2);
}
const Database = load();
new Database(db, { readonly: true, fileMustExist: true })
  .backup(out)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
