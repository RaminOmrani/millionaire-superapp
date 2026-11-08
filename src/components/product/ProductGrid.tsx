import { holding } from "@/content/holding";
import { ProductTile, ServiceTile, type TileProduct, type TileService } from "./ProductTile";

const SERVICES: TileService[] = [
  { key: "support", title: "پشتیبانی", description: "ثبت و پیگیری تیکت برای همه‌ی محصولات", href: holding.supportCenter, external: true },
  { key: "consult", title: "درخواست مشاوره", description: "کارشناسان ما با شما تماس می‌گیرند", href: "/consult" },
  { key: "about", title: "درباره ما", description: `آشنایی با ${holding.nameFa}`, href: "/about" },
];

/** 5 products + 3 services → 2 columns × 4 rows on phones, 4 × 2 on desktop. */
export function ProductGrid({ products }: { products: TileProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {products.map((product, i) => (
        <ProductTile key={product.slug} product={product} index={i} />
      ))}
      {SERVICES.map((service, i) => (
        <ServiceTile key={service.key} service={service} index={products.length + i} />
      ))}
    </ul>
  );
}
