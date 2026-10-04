"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { Product } from "@/content/products";
import { cn } from "@/lib/utils";

/** Only the fields the tile renders — works for base and resolved products. */
export type TileProduct = Pick<Product, "slug" | "nameFa" | "tagline" | "status" | "accent" | "logo">;

interface Props {
  product: TileProduct;
  index: number;
  /** Tailwind grid placement classes */
  className?: string;
}

const COMING_SOON = "به‌زودی";

/**
 * Product tile. Every tile shows the product mark in the same fixed box so all logos read at the
 * same size (Ramin). The accent bleed uses `accent.glow` when the primary is too dark to show
 * (Menu Club navy), so every tile lights up on hover.
 */
export function ProductTile({ product, index, className }: Props) {
  const reduce = useReducedMotion();
  const soon = product.status === "coming_soon";
  const glow = product.accent.glow ?? product.accent.primary;

  const style = {
    "--accent": product.accent.primary,
    "--accent-2": product.accent.secondary,
    "--glow": glow,
  } as CSSProperties;

  const entrance = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px" },
        transition: { duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <motion.div
      {...entrance}
      style={style}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={reduce ? undefined : { scale: 0.985 }}
      className={cn(
        "grain group relative isolate flex min-h-[230px] overflow-hidden rounded-tile border bg-surface",
        "border-[color-mix(in_oklab,var(--glow)_35%,transparent)]",
        "shadow-[0_24px_60px_-36px_color-mix(in_oklab,var(--glow)_75%,transparent)]",
        "transition-[border-color,box-shadow,opacity,filter] duration-500",
        "hover:border-[color-mix(in_oklab,var(--glow)_75%,transparent)] hover:shadow-[0_34px_80px_-30px_color-mix(in_oklab,var(--glow)_90%,transparent)]",
        soon && "opacity-80 saturate-[0.65] hover:opacity-100 hover:saturate-100",
        className,
      )}
    >
      {/* accent bleed — brightens on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--glow) calc(var(--tile-glow) * 110%), transparent) 0%, transparent 60%)," +
            "radial-gradient(80% 70% at 0% 100%, color-mix(in oklab, var(--accent-2) calc(var(--tile-glow) * 55%), transparent) 0%, transparent 65%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 size-[55%] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--glow) 70%, transparent)", top: "-20%", right: "-10%", opacity: 0.55 }}
        variants={{ rest: { x: 0, y: 0, scale: 1 }, hover: { x: -24, y: 24, scale: 1.2 } }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <Link
        href={`/${product.slug}`}
        className="absolute inset-0 z-20 rounded-tile"
        aria-label={`${product.nameFa} — ${product.tagline}${soon ? " (به‌زودی)" : ""}`}
      />

      <div className="relative z-10 flex w-full flex-col gap-5 p-5 sm:p-6">
        {/* status (start) · link arrow (end = top-left in RTL) */}
        <div className="flex w-full items-start justify-between gap-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
              soon ? "border-line bg-bg/40 text-fg-muted" : "border-white/15 bg-white/10 text-white light:border-line light:bg-bg/60 light:text-fg",
            )}
          >
            {soon ? (
              <>
                <Clock className="size-3" aria-hidden />
                {COMING_SOON}
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-[var(--glow)]" aria-hidden />
                فعال
              </>
            )}
          </span>
          <motion.span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white light:border-line light:bg-bg/60 light:text-fg"
            variants={{ rest: { x: 0, y: 0 }, hover: { x: -4, y: -4 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowUpLeft className="size-4" />
          </motion.span>
        </div>

        <div className="flex h-24 items-center justify-center sm:h-28">
          <motion.div
            variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.06, y: -3 } }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="flex h-full items-center justify-center"
          >
            <Image
              src={product.logo.mark}
              alt={`لوگوی ${product.nameFa}`}
              width={200}
              height={200}
              priority={index < 2}
              className={cn(
                "h-full w-auto max-w-[140px] object-contain drop-shadow-[0_16px_34px_rgba(0,0,0,0.45)]",
                product.logo.markLight && "light:hidden",
              )}
            />
            {product.logo.markLight && (
              <Image
                src={product.logo.markLight}
                alt=""
                aria-hidden
                width={200}
                height={200}
                className="hidden h-full w-auto max-w-[140px] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.12)] light:block"
              />
            )}
          </motion.div>
        </div>

        <div className="text-center">
          <h3 className="display text-balance text-xl sm:text-2xl">{product.nameFa}</h3>
          <p className="mt-1.5 text-sm text-fg-muted">{product.tagline}</p>
        </div>
      </div>
    </motion.div>
  );
}
