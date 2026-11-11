import "server-only";
import { getSetting } from "@/lib/auth";
import { CLUB_DEFAULT_TITLE, CLUB_TEXT_MAX, CLUB_TITLE_MAX, isSafeClubHref } from "@/lib/club";
import type { ClubValues } from "@/lib/validation";

/** Settings keys (key-value `settings` table) behind the landing's customer-club section. */
export const CLUB_KEYS = { title: "club_title", text: "club_text", href: "club_href" } as const;

export interface ClubView {
  title: string;
  text: string;
  href?: string;
  external: boolean;
}

/** Raw admin values, for the settings form. */
export function getClubSettings(): ClubValues {
  return {
    title: getSetting(CLUB_KEYS.title) ?? "",
    text: getSetting(CLUB_KEYS.text) ?? "",
    href: getSetting(CLUB_KEYS.href) ?? "",
  };
}

/**
 * The section as the landing renders it, or null while the admin has not written a text.
 * There is no club content in data.md, so nothing here has a baseline: no text → no section.
 */
export function getClub(): ClubView | null {
  const raw = getClubSettings();
  const text = raw.text.trim().slice(0, CLUB_TEXT_MAX);
  if (!text) return null;
  const title = raw.title.trim().slice(0, CLUB_TITLE_MAX) || CLUB_DEFAULT_TITLE;
  // Re-checked on read too, so a value written by anything but the admin action can never become a javascript: link.
  const href = raw.href.trim() && isSafeClubHref(raw.href.trim()) ? raw.href.trim() : undefined;
  return { title, text, href, external: !!href && /^https?:\/\//i.test(href) };
}
