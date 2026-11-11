/** Customer-club section limits and link rule — shared by the admin form (client), zod and the landing. */

export const CLUB_DEFAULT_TITLE = "باشگاه مشتریان";
export const CLUB_TEXT_MAX = 300;
export const CLUB_TITLE_MAX = 60;

/** A link the landing may render — same rule as every other admin-entered link. */
export { isSafeHref as isSafeClubHref } from "./safe-href";
