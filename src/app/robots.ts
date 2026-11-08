import type { MetadataRoute } from "next";
import { holding } from "@/content/holding";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${holding.appDomain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
