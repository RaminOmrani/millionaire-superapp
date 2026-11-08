import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { redirect } from "next/navigation";

export interface AdminSession {
  admin?: { username: string; loggedInAt: number };
}

export const SESSION_COOKIE = "msa_admin";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters (see .env.example).");
  }
  return s;
}

export function sessionOptions(): SessionOptions {
  return {
    password: secret(),
    cookieName: SESSION_COOKIE,
    ttl: 60 * 60 * 12, // 12h
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions());
}

/** Server components / actions under /admin call this; unauthenticated → /admin/login. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session.admin) redirect("/admin/login");
  return session.admin;
}
