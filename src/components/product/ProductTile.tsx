"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { Product } from "@/content/products";

/** Only the fields the tile renders — works for base and resolved products. */
export type TileProduct = Pick<Product, "slug" | "nameFa" | "tagline" | "status" | "accent" | "logo">;
import { cn } from "@/lib/utils";

interface Props {
  product: TileProduct;
  index: number;
  /** Tailwind grid placement classes for the asymmetric layout */
  className?: string;
  /** Hero tile: larger logo and title */
  emphasis?: boolean;
}

const COMING_SOON = "به‌زودی";

export function ProductTile({ product, index, className, emphasis = false }: Props) {
  const reduce = useReducedMotion();
  const locked = product.status === "coming_soon";

  const style = {
    "--accent": product.accent.primary,
    "--accent-2": product.accent.secondary,
  } as CSSProperties;

  const logoClass = cn(
    "mx-auto h-auto w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] light:drop-shadow-[0_12px_30px_rgba(0,0,0,0.12)]",
    emphasis ? "max-h-48 sm:max-h-64" : "max-h-28 sm:max-h-36",
  );

  const inner = (
    <>
      {/* accent bleed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--accent) calc(var(--tile-glow) * 100%), transparent) 0%, transparent 60%)," +
            "radial-gradient(80% 70% at 0% 100%, color-mix(in oklab, var(--accent-2) calc(var(--tile-glow) * 55%), transparent) 0%, transparent 65%)",
        }}
      />
      {/* moving glow blob */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 size-[60%] rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--accent) 65%, transparent)",
          top: "-20%",
          right: "-10%",
          opacity: 0.6,
        }}
        variants={{
          rest: { x: 0, y: 0, scale: 1 },
          hover: { x: -24, y: 24, scale: 1.15 },
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
              locked
                ? "border-line bg-bg/40 text-fg-muted"
                : "border-white/15 bg-white/10 text-white light:border-line light:bg-bg/60 light:text-fg",
            )}
          >
            {locked ? (
              <>
                <Lock className="size-3" aria-hidden />
                {COMING_SOON}
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-[var(--accent)] light:bg-[var(--accent)]" aria-hidden />
                فعال
              </>
            )}
          </span>

          {!locked && (
            <motion.span
              aria-hidden
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white light:border-line light:bg-bg/60 light:text-fg"
              variants={{ rest: { x: 0, y: 0 }, hover: { x: -4, y: -4 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ArrowUpLeft className="size-5" />
            </motion.span>
          )}
        </div>

        <div
          className={cn(
            "relative flex items-center justify-center",
            emphasis ? "min-h-40 sm:min-h-56" : "min-h-28 sm:min-h-36",
          )}
        >
          <motion.div
            variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.04, y: -4 } }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="w-full"
          >
            <Image
              src={product.logo.landing}
              alt={`لوگوی ${product.nameFa}`}
              width={1080}
              height={720}
              priority={index < 2}
              className={cn(logoClass, product.logo.landingLight && "light:hidden")}
            />
            {product.logo.landingLight && (
              <Image
                src={product.logo.landingLight}
                alt=""
                aria-hidden
                width={1080}
                height={720}
                className={cn(logoClass, "hidden light:block")}
              />
            )}
          </motion.div>
        </div>

        <div>
          <h3
            className={cn(
              "display text-balance",
              emphasis ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl",
            )}
          >
            {product.nameFa}
          </h3>
          <p className={cn("mt-2 text-fg-muted", emphasis ? "text-base sm:text-lg" : "text-sm sm:text-base")}>
            {product.tagline}
          </p>
        </div>
      </div>
    </>
  );

  const shell = cn(
    "grain group relative isolate flex h-full min-h-[300px] overflow-hidden rounded-tile border bg-surface",
    "border-[color-mix(in_oklab,var(--accent)_35%,transparent)]",
    "shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--accent)_70%,transparent)]",
    "transition-[border-color,box-shadow] duration-500",
    locked
      ? "cursor-not-allowed opacity-60 saturate-50"
      : "hover:border-[color-mix(in_oklab,var(--accent)_70%,transparent)] hover:shadow-[0_40px_100px_-30px_color-mix(in_oklab,var(--accent)_85%,transparent)]",
    className,
  );

  const entrance = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px" },
        transition: { duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as const },
      };

  if (locked) {
    return (
      <motion.div
        {...entrance}
        className={shell}
        style={style}
        role="link"
        aria-disabled="true"
        tabIndex={0}
        title={COMING_SOON}
        initial="rest"
        animate="rest"
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.div
      {...entrance}
      className={shell}
      style={style}
      initial="rest"
      whileHover="hover"
      whileTap={reduce ? undefined : { scale: 0.985 }}
      animate="rest"
    >
      <Link
        href={`/${product.slug}`}
        className="absolute inset-0 z-20 rounded-tile"
        aria-label={`${product.nameFa} — ${product.tagline}`}
      />
      {inner}
    </motion.div>
  );
}
