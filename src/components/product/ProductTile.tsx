"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { ServiceIcon, type ServiceIconName } from "@/components/brand/ServiceIcon";
import type { Product } from "@/content/products";
import { cn } from "@/lib/utils";

/** Only the fields the tile renders — works for base and resolved products. */
export type TileProduct = Pick<Product, "slug" | "nameFa" | "tagline" | "status" | "accent" | "logo">;

export interface TileService {
  key: ServiceIconName;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const BRAND_RED = { accent: "#980000", glow: "#c42a2a" };

const cardBase =
  "grain group relative isolate flex h-full min-h-[150px] flex-col overflow-hidden rounded-[1.4rem] border bg-surface p-4 sm:min-h-[170px] sm:p-5 " +
  "border-[color-mix(in_oklab,var(--glow)_30%,transparent)] shadow-[0_18px_44px_-30px_color-mix(in_oklab,var(--glow)_80%,transparent)] " +
  "transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 " +
  "hover:border-[color-mix(in_oklab,var(--glow)_70%,transparent)] hover:shadow-[0_26px_60px_-28px_color-mix(in_oklab,var(--glow)_95%,transparent)]";

function Glow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-75 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(110% 80% at 100% 0%, color-mix(in oklab, var(--glow) calc(var(--tile-glow) * 95%), transparent) 0%, transparent 62%)",
      }}
    />
  );
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fg-muted transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg light:border-line light:bg-bg/60"
    >
      <ArrowUpLeft className="size-3.5" />
    </span>
  );
}

function useEntrance(index: number) {
  const reduce = useReducedMotion();
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-8% 0px" },
        transition: { duration: 0.5, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] as const },
      };
}

/**
 * Compact product card: mark in a fixed square (same size for every product), name, one-line
 * tagline, link arrow top-left. Two columns on phones, four on desktop.
 */
export function ProductTile({ product, index }: { product: TileProduct; index: number }) {
  const entrance = useEntrance(index);
  const soon = product.status === "coming_soon";
  const style = { "--glow": product.accent.glow ?? product.accent.primary } as CSSProperties;

  return (
    <motion.li {...entrance} className="list-none">
      <Link
        href={`/${product.slug}`}
        style={style}
        aria-label={`${product.nameFa} — ${product.tagline}${soon ? " (به‌زودی)" : ""}`}
        className={cn(cardBase, soon && "opacity-80 saturate-[0.65] hover:opacity-100 hover:saturate-100")}
      >
        <Glow />
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-bg/40 p-2 sm:size-14 light:border-line light:bg-bg-elevated">
            <Image
              src={product.logo.mark}
              alt=""
              width={96}
              height={96}
              priority={index < 4}
              className={cn("h-full w-full object-contain", product.logo.markLight && "light:hidden")}
            />
            {product.logo.markLight && (
              <Image src={product.logo.markLight} alt="" width={96} height={96} className="hidden h-full w-full object-contain light:block" />
            )}
          </span>
          {soon ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold text-fg-muted">
              <Clock className="size-3" aria-hidden />
              به‌زودی
            </span>
          ) : (
            <Arrow />
          )}
        </div>
        <div className="mt-auto pt-4">
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-6 sm:text-lg sm:leading-7">{product.nameFa}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-fg-muted sm:text-[13px]">{product.tagline}</p>
        </div>
      </Link>
    </motion.li>
  );
}

/** Same card shape for holding services (support / consult / about), in brand red. */
export function ServiceTile({ service, index }: { service: TileService; index: number }) {
  const entrance = useEntrance(index);
  const style = { "--glow": BRAND_RED.glow } as CSSProperties;
  const body = (
    <>
      <Glow />
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-bg/40 p-2.5 sm:size-14 light:border-line light:bg-bg-elevated">
          <ServiceIcon name={service.key} className="h-full w-full" />
        </span>
        <Arrow />
      </div>
      <div className="mt-auto pt-4">
        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-6 sm:text-lg sm:leading-7">{service.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-fg-muted sm:text-[13px]">{service.description}</p>
      </div>
    </>
  );
  return (
    <motion.li {...entrance} className="list-none">
      {service.external ? (
        <a href={service.href} target="_blank" rel="noopener noreferrer" style={style} className={cardBase}>
          {body}
        </a>
      ) : (
        <Link href={service.href} style={style} className={cardBase}>
          {body}
        </Link>
      )}
    </motion.li>
  );
}
