import type { ProductSlug } from "@/content/products";
import { ProductTile, type TileProduct } from "./ProductTile";

/** Two flagship tiles on the first row, three on the second (desktop); one column on phones. */
const LAYOUT: Record<ProductSlug, string> = {
  millionaire: "sm:col-span-3 lg:col-span-3",
  crm: "sm:col-span-3 lg:col-span-3",
  shopmojahaz: "sm:col-span-2 lg:col-span-2",
  menuclub: "sm:col-span-2 lg:col-span-2",
  garson: "sm:col-span-2 lg:col-span-2",
};

export function ProductGrid({ products }: { products: TileProduct[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5">
      {products.map((product, i) => (
        <ProductTile key={product.slug} product={product} index={i} className={LAYOUT[product.slug]} />
      ))}
    </div>
  );
}
