import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import type { Banner } from "@/db/schema";
import { holding } from "./holding";
import { products } from "./products";
import { toPersianDigits } from "@/lib/persian-digits";

/** Plain data for the carousel (client component). */
export interface BannerView {
  id: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  external: boolean;
  image?: string;
  audience: Banner["audience"];
  accent: string;
  accent2: string;
  mark?: string;
  markLight?: string;
}

export const BANNER_THEMES: Array<{ value: string; label: string; accent: string; accent2: string }> = [
  { value: "brand", label: "هلدینگ میلیونر", accent: "#980000", accent2: "#600000" },
  ...products.map((p) => ({ value: p.slug, label: p.nameFa, accent: p.accent.primary, accent2: p.accent.secondary })),
];

export function toBannerView(b: Banner): BannerView {
  const theme = BANNER_THEMES.find((t) => t.value === b.theme) ?? BANNER_THEMES[0]!;
  const product = products.find((p) => p.slug === b.theme);
  return {
    id: b.id,
    title: b.title ?? undefined,
    subtitle: b.subtitle ?? undefined,
    ctaLabel: b.ctaLabel ?? undefined,
    href: b.href ?? undefined,
    external: !!b.href && /^https?:\/\//.test(b.href),
    image: b.image ? `/media/banners/${b.image}` : undefined,
    audience: b.audience,
    accent: theme.accent,
    accent2: theme.accent2,
    mark: product ? product.logo.mark : "/brand/millionaire/mark.svg",
    markLight: product?.logo.markLight,
  };
}

/**
 * Shown only while a slot has no live admin banner, so the layout never looks empty.
 * Built strictly from content Ramin supplied (Garson-yar motto, holding facts) — no invented offers.
 */
function houseBanner(placement: Banner["placement"]): BannerView {
  const garson = products.find((p) => p.slug === "garson");
  const theme = (slug: string) => BANNER_THEMES.find((t) => t.value === slug) ?? BANNER_THEMES[0]!;
  if (placement === "top" && garson) {
    const t = theme("garson");
    return {
      id: -1,
      title: "گارسون‌یار فعال شد",
      subtitle: garson.motto?.replace(/^گارسون‌یار؛\s*/, "").replace(/\.$/, "") ?? garson.tagline,
      ctaLabel: "آشنایی",
      href: "/garson",
      external: false,
      audience: "both",
      accent: t.accent,
      accent2: t.accent2,
      mark: garson.logo.mark,
      markLight: garson.logo.markLight,
    };
  }
  const t = theme("brand");
  return {
    id: -2,
    title: `همراه +${toPersianDigits(holding.customers)} کسب‌وکار`,
    subtitle: `در سراسر کشور، از سال ${toPersianDigits(holding.foundedYear)}`,
    ctaLabel: "درخواست مشاوره",
    href: "/consult",
    external: false,
    audience: "both",
    accent: t.accent,
    accent2: t.accent2,
    mark: "/brand/millionaire/mark.svg",
  };
}

/** Active banners for a slot, respecting the optional start/end window; house banner when empty. */
export function getLiveBanners(placement: Banner["placement"]): BannerView[] {
  const live = getAdminBanners(placement);
  return live.length > 0 ? live : [houseBanner(placement)];
}

function getAdminBanners(placement: Banner["placement"]): BannerView[] {
  const now = Date.now();
  const rows = getDb()
    .select()
    .from(schema.banners)
    .where(and(eq(schema.banners.active, true), eq(schema.banners.placement, placement)))
    .orderBy(asc(schema.banners.sort), desc(schema.banners.id))
    .all();
  return rows
    .filter((b) => (!b.startsAt || b.startsAt.getTime() <= now) && (!b.endsAt || b.endsAt.getTime() >= now))
    .map(toBannerView);
}
