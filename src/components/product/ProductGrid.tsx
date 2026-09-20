import type { ProductSlug } from "@/content/products";
import { ProductTile, type TileProduct } from "./ProductTile";

/** Asymmetric editorial layout on desktop; single column on mobile. */
const LAYOUT: Record<ProductSlug, { className: string; emphasis?: boolean }> = {
  millionaire: { className: "lg:col-span-7 lg:row-span-2", emphasis: true },
  crm: { className: "lg:col-span-5" },
  shopmojahaz: { className: "lg:col-span-5" },
  menuclub: { className: "lg:col-span-7" },
  garson: { className: "lg:col-span-5" },
};

export function ProductGrid({ products }: { products: TileProduct[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:auto-rows-[minmax(300px,auto)]">
      {products.map((product, i) => (
        <ProductTile
          key={product.slug}
          product={product}
          index={i}
          className={LAYOUT[product.slug].className}
          emphasis={LAYOUT[product.slug].emphasis}
        />
      ))}
    </div>
  );
}
