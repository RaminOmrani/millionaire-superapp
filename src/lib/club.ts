/** Customer-club section limits and link rule — shared by the admin form (client), zod and the landing. */

export const CLUB_DEFAULT_TITLE = "باشگاه مشتریان";
export const CLUB_TEXT_MAX = 300;
export const CLUB_TITLE_MAX = 60;

/**
 * A link the landing may render: an absolute http(s) URL, or an internal path ("/…", not "//host").
 * Anything else (javascript:, data:, mailto:, relative paths, protocol-relative URLs) is rejected.
 */
export function isSafeClubHref(value: string): boolean {
  if (value.startsWith("/")) return !value.startsWith("//") && !value.startsWith("/\\") && !/\s/.test(value);
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname;
  } catch {
    return false;
  }
}
