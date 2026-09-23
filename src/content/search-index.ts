import "server-only";
import { holding } from "./holding";
import type { ResolvedProduct } from "./resolve";
import { normalizeFa, type SearchItem } from "@/lib/search";

/** Everything the launcher search can jump to: products, their enabled actions, and site pages. */
export function buildSearchIndex(products: ResolvedProduct[]): SearchItem[] {
  const items: SearchItem[] = [];

  for (const p of products) {
    items.push({
      id: `p:${p.slug}`,
      kind: "product",
      title: p.nameFa,
      subtitle: p.status === "active" ? p.tagline : `${p.tagline}، به‌زودی`,
      href: `/${p.slug}`,
      accent: p.accent.primary,
      haystack: normalizeFa(
        [
          p.nameFa,
          p.nameEn,
          p.tagline,
          p.description ?? "",
          ...p.features,
          ...(p.featureGroups ?? []).flatMap((g) => [g.title, ...g.items.map((i) => i.text)]),
        ].join(" "),
      ),
    });

    for (const a of p.actions) {
      if (!a.enabled) continue;
      const external = !!a.href && !a.plans?.length;
      items.push({
        id: `a:${p.slug}:${a.key}`,
        kind: "action",
        title: a.label,
        subtitle: p.nameFa,
        href: external ? a.href! : `/${p.slug}#${a.key}`,
        external,
        accent: p.accent.primary,
        haystack: normalizeFa(
          [a.label, p.nameFa, p.nameEn, ...(a.content ?? []), ...(a.plans?.map((pl) => pl.name) ?? [])].join(" "),
        ),
      });
    }
  }

  const pages: Array<Omit<SearchItem, "haystack"> & { keywords: string }> = [
    { id: "pg:consult", kind: "page", title: "درخواست مشاوره", subtitle: "کارشناسان ما با شما تماس می‌گیرند", href: "/consult", keywords: "مشاوره تماس خرید راهنمایی فرم" },
    { id: "pg:support", kind: "page", title: "مرکز پشتیبانی", subtitle: "support.softmiliac.com", href: holding.supportCenter, external: true, keywords: "تیکت پشتیبانی مشکل ticket support" },
    { id: "pg:about", kind: "page", title: "درباره‌ی هلدینگ", subtitle: holding.subtitle, href: "/about", keywords: `درباره ما هلدینگ میلیونر آدرس ایمیل تلفن مدیرعامل نقشه اینستاگرام آپارات ${holding.address}` },
    { id: "pg:call", kind: "page", title: "تماس تلفنی", subtitle: holding.phone, href: `tel:${holding.phone.replace(/-/g, "")}`, keywords: "تلفن تماس شماره call" },
  ];
  for (const pg of pages) {
    const { keywords, ...rest } = pg;
    items.push({ ...rest, haystack: normalizeFa(`${pg.title} ${pg.subtitle ?? ""} ${keywords}`) });
  }
  return items;
}
