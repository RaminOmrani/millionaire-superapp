/**
 * Runs once when the Node.js server starts: opens the SQLite file and applies
 * pending migrations immediately, so the DB exists (and is backup-able) before
 * the first request instead of lazily on first use.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getDb } = await import("./db/client");
    getDb();
  }
}
