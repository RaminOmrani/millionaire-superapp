import type { MetadataRoute } from "next";
import { holding } from "@/content/holding";
import { products } from "@/content/products";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${holding.appDomain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/consult`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...products.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.status === "active" ? 0.9 : 0.4,
    })),
  ];
}
