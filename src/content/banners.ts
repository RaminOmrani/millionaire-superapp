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
  /** Built-in glyph in place of a logo mark (house banners only). */
  icon?: "consult";
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

const theme = (slug: string) => BANNER_THEMES.find((t) => t.value === slug) ?? BANNER_THEMES[0]!;

/**
 * Top-slot fallback while no admin banner is live there: a slim consultation CTA.
 * Built only from real features (the /consult form) and deliberately different from the middle house slides.
 */
function houseTopBanner(): BannerView {
  const t = theme("brand");
  return {
    id: -1,
    title: "درخواست مشاوره",
    subtitle: "برای انتخاب محصول مناسب کسب‌وکارتان درخواست ثبت کنید؛ کارشناسان ما با شما تماس می‌گیرند.",
    ctaLabel: "ثبت درخواست",
    href: "/consult",
    external: false,
    audience: "both",
    accent: t.accent,
    accent2: t.accent2,
    icon: "consult",
  };
}

/**
 * Middle-slot fallback slides while no admin banner is live there. Built strictly from content
 * Ramin supplied (holding facts, Garson-yar motto) — no invented offers.
 */
function houseMiddleBanners(): BannerView[] {
  const brand = theme("brand");
  const slides: BannerView[] = [
    {
      id: -2,
      title: `همراه +${toPersianDigits(holding.customers)} کسب‌وکار`,
      subtitle: `در سراسر کشور، از سال ${toPersianDigits(holding.foundedYear)}`,
      ctaLabel: "درخواست مشاوره",
      href: "/consult",
      external: false,
      audience: "both",
      accent: brand.accent,
      accent2: brand.accent2,
      mark: "/brand/millionaire/mark.svg",
    },
  ];
  const garson = products.find((p) => p.slug === "garson");
  if (garson) {
    const t = theme("garson");
    slides.push({
      id: -3,
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
    });
  }
  return slides;
}

/**
 * Top slot = ONE fixed banner. Returns the live admin top banners (same ordering as the panel:
 * sort asc, newest first) followed by the house banner; `FixedBanner` shows the first one that fits
 * each surface (website / installed app), so the house banner only appears where nothing else is live.
 */
export function getTopBanners(): BannerView[] {
  return [...getAdminBanners("top"), houseTopBanner()];
}

/** Middle slot = slider of every live admin banner, respecting the optional date window; house slides when empty. */
export function getMiddleBanners(): BannerView[] {
  const live = getAdminBanners("middle");
  return live.length > 0 ? live : houseMiddleBanners();
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
