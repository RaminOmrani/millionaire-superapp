import type { MetadataRoute } from "next";
import { holding } from "@/content/holding";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: holding.nameFa,
    short_name: "میلیونر",
    description: `${holding.subtitle} — ${holding.slogan}`,
    lang: "fa-IR",
    dir: "rtl",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#0f0f12",
    theme_color: "#0f0f12",
    categories: ["business", "productivity"],
    shortcuts: [
      { name: "جست‌وجو", short_name: "جست‌وجو", url: "/#search", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "درخواست مشاوره", short_name: "مشاوره", url: "/consult", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "درباره‌ی هلدینگ", short_name: "درباره", url: "/about", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
