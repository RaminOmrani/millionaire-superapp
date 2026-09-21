"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { ProductSlug } from "@/content/products";
import { cn } from "@/lib/utils";

interface Mark {
  slug: ProductSlug;
  name: string;
  dark: string;
  light: string;
  accent: string;
  accent2: string;
  locked?: boolean;
  /** grid placement + size — asymmetric on purpose */
  className: string;
  delay: number;
}

/** Marks chosen per surface: the navy Menu Club / Garson marks vanish on dark, the white ones on light. */
const MARKS: Mark[] = [
  {
    slug: "millionaire",
    name: "حسابداری میلیونر",
    dark: "/brand/millionaire/mark.svg",
    light: "/brand/millionaire/mark.svg",
    accent: "#980000",
    accent2: "#600000",
    className: "col-span-3 row-span-3 col-start-1 row-start-1",
    delay: 0,
  },
  {
    slug: "crm",
    name: "CRM میلیونر",
    dark: "/brand/crm/mark-red.svg",
    light: "/brand/crm/mark-red.svg",
    accent: "#981818",
    accent2: "#600000",
    className: "col-span-2 row-span-2 col-start-4 row-start-1",
    delay: 0.8,
  },
  {
    slug: "shopmojahaz",
    name: "شاپ مجهز",
    dark: "/brand/shopmojahaz/mark.svg",
    light: "/brand/shopmojahaz/mark.svg",
    accent: "#0048a8",
    accent2: "#0068c0",
    className: "col-span-2 row-span-2 col-start-4 row-start-3",
    delay: 1.6,
  },
  {
    slug: "menuclub",
    name: "منوکلاب",
    dark: "/brand/menuclub/swoosh-3.svg",
    light: "/brand/menuclub/mark.svg",
    accent: "#101840",
    accent2: "#f8b878",
    className: "col-span-2 row-span-2 col-start-1 row-start-4",
    delay: 2.4,
  },
  {
    slug: "garson",
    name: "گارسون‌یار",
    dark: "/brand/garson/mark-round.svg",
    light: "/brand/garson/logo-full.svg",
    accent: "#c80840",
    accent2: "#101840",
    locked: true,
    className: "col-span-1 row-span-1 col-start-3 row-start-4",
    delay: 3.2,
  },
];

export function HeroVisual({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative", className)} aria-hidden>
      {/* soft field behind the marks */}
      <div
        className="pointer-events-none absolute inset-[-20%] -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-brand-red) 28%, transparent), transparent 70%)",
        }}
      />
      <div className="grid aspect-square w-full max-w-[520px] grid-cols-5 grid-rows-5 gap-3 sm:gap-4">
        {MARKS.map((m, i) => (
          <motion.div
            key={m.slug}
            className={cn("relative", m.className)}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="h-full w-full"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
            >
              <Link
                href={m.locked ? "#products" : `/${m.slug}`}
                tabIndex={-1}
                title={m.name}
                className={cn(
                  "grain group flex h-full w-full items-center justify-center overflow-hidden rounded-[22%] border bg-surface p-[16%] transition-transform duration-500 hover:-translate-y-1",
                  "border-[color-mix(in_oklab,var(--accent)_35%,transparent)] shadow-[0_30px_70px_-35px_color-mix(in_oklab,var(--accent)_80%,transparent)]",
                  m.locked && "opacity-55 saturate-50",
                )}
                style={{ "--accent": m.accent, "--accent-2": m.accent2 } as CSSProperties}
              >
                <span
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(110% 90% at 100% 0%, color-mix(in oklab, var(--accent) calc(var(--tile-glow) * 100%), transparent), transparent 62%)",
                  }}
                />
                <Image src={m.dark} alt="" width={400} height={400} className="h-full w-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] light:hidden" priority={i < 2} />
                <Image src={m.light} alt="" width={400} height={400} className="hidden h-full w-auto object-contain light:block" />
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
