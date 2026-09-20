import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { getDb, schema } from "@/db/client";

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** scrypt hash → "salt:hash" (hex). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(candidate, hash);
}

export function getSetting(key: string): string | undefined {
  return getDb().select().from(schema.settings).where(eq(schema.settings.key, key)).get()?.value;
}

export function setSetting(key: string, value: string): void {
  getDb()
    .insert(schema.settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date() } })
    .run();
}

/**
 * Admin password: a hash saved from /admin/settings wins; otherwise ADMIN_PASSWORD from .env.
 * Username always comes from ADMIN_USERNAME.
 */
export function checkAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  if (!expectedUser || !safeEqual(username, expectedUser)) return false;
  const stored = getSetting("password_hash");
  if (stored) return verifyPassword(password, stored);
  const envPass = process.env.ADMIN_PASSWORD ?? "";
  return !!envPass && safeEqual(password, envPass);
}

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_USERNAME && (!!process.env.ADMIN_PASSWORD || !!getSetting("password_hash"));
}

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

/** True when this IP has too many recent failed logins. */
export function loginThrottled(ip: string): boolean {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = getDb()
    .select({ id: schema.loginAttempts.id })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.ip, ip), eq(schema.loginAttempts.success, false), gt(schema.loginAttempts.createdAt, since)))
    .all();
  return rows.length >= MAX_FAILURES;
}

export function recordLogin(ip: string, username: string, success: boolean): void {
  getDb().insert(schema.loginAttempts).values({ ip, username: username.slice(0, 120), success }).run();
}
