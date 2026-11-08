import { BANNER_THEMES } from "@/content/banners";
import { products } from "@/content/products";

/** Themes plus the mark each one shows — plain data for the client form. */
export function bannerThemesWithMarks() {
  return BANNER_THEMES.map((t) => {
    const p = products.find((x) => x.slug === t.value);
    return { ...t, mark: p ? p.logo.mark : "/brand/millionaire/mark.svg", markLight: p?.logo.markLight };
  });
}
