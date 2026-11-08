import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

export type Db = ReturnType<typeof open>;

function open() {
  const dbPath = process.env.DATABASE_PATH ?? "./data/app.db";
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  // Apply pending migrations from ./drizzle on first open (idempotent).
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db;
}

// One connection per process; lazy so `next build` never touches the file.
const globalForDb = globalThis as unknown as { __db?: Db };

export function getDb(): Db {
  if (!globalForDb.__db) globalForDb.__db = open();
  return globalForDb.__db;
}

export { schema };
