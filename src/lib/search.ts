import { toLatinDigits } from "./persian-digits";

/** Normalise Persian/Arabic variants so «كيك» finds «کیک», ZWNJ and diacritics don't matter. */
export function normalizeFa(input: string): string {
  return toLatinDigits(input)
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ةۀ]/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[‌‏‎]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export interface SearchItem {
  id: string;
  kind: "product" | "action" | "page";
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
  /** CSS colour for the item's dot/icon */
  accent?: string;
  /** Pre-normalised text the query is matched against */
  haystack: string;
}

export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const q = normalizeFa(query);
  if (!q) return [];
  const tokens = q.split(" ");
  const scored: Array<{ item: SearchItem; score: number }> = [];
  for (const item of items) {
    if (!tokens.every((t) => item.haystack.includes(t))) continue;
    const title = normalizeFa(item.title);
    let score = item.kind === "product" ? 3 : item.kind === "page" ? 2 : 1;
    if (title.startsWith(q)) score += 5;
    else if (title.includes(q)) score += 3;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}
