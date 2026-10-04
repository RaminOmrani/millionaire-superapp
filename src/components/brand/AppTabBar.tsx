"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, LifeBuoy, MessageSquareText, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

type Tab = { key: string; label: string; href: string; icon: typeof Home; external?: boolean };

const SIDE_START: Tab[] = [
  { key: "home", label: "خانه", href: "/", icon: Home },
  { key: "consult", label: "مشاوره", href: "/consult", icon: MessageSquareText },
];
const SIDE_END: Tab[] = [
  { key: "support", label: "پشتیبانی", href: holding.supportCenter, icon: LifeBuoy, external: true },
  { key: "about", label: "درباره ما", href: "/about", icon: Info },
];

/**
 * Floating glass tab bar — installed app only. A sliding pill marks the active tab and the
 * search action sits raised in the middle, in brand red.
 */
export function AppTabBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isActive = (t: Tab) => (t.key === "home" ? pathname === "/" : !t.external && pathname.startsWith(t.href));

  const renderTab = (t: Tab) => {
    const Icon = t.icon;
    const active = isActive(t);
    const inner = (
      <>
        <span className="relative inline-flex h-8 w-12 items-center justify-center">
          {active && (
            <motion.span
              layoutId="tab-pill"
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--color-brand-red)_26%,transparent)] shadow-[0_0_24px_-4px_var(--color-brand-red)] light:bg-[color-mix(in_oklab,var(--color-brand-red)_12%,transparent)] light:shadow-none"
            />
          )}
          <Icon
            className={cn(
              "relative size-[22px] transition-colors",
              active ? "text-[#ff7a7a] light:text-brand-red" : "text-fg-muted",
            )}
            strokeWidth={active ? 2.4 : 2}
            aria-hidden
          />
        </span>
        <span className={cn("text-[11px] font-bold transition-colors", active ? "text-fg" : "text-fg-faint")}>{t.label}</span>
      </>
    );
    const cls = "flex flex-col items-center gap-0.5 py-2 transition active:scale-95";
    return (
      <li key={t.key} className="flex-1">
        {t.external ? (
          <a href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>
            {inner}
          </a>
        ) : (
          <Link href={t.href} className={cls} aria-current={active ? "page" : undefined}>
            {inner}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav
      aria-label="نوار اپ"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] app:block"
    >
      <div className="pointer-events-auto relative mx-auto max-w-md">
        {/* glass body */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[1.75rem] border border-white/10 bg-[color-mix(in_oklab,var(--surface)_62%,transparent)] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 light:border-black/5 light:bg-white/70 light:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]"
        />
        <ul className="relative flex items-end px-1">
          {SIDE_START.map(renderTab)}
          <li className="flex flex-1 justify-center">
            <Link
              href="/#search"
              aria-label="جست‌وجو"
              className="group -mt-6 mb-1 flex flex-col items-center gap-1"
            >
              <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-[#c42a2a] to-brand-red-deep text-white shadow-[0_12px_28px_-8px_var(--color-brand-red),inset_0_1px_0_rgba(255,255,255,0.25)] ring-4 ring-bg transition group-active:scale-95">
                <Search className="size-6" strokeWidth={2.4} aria-hidden />
              </span>
              <span className="text-[11px] font-bold text-fg-muted">جست‌وجو</span>
            </Link>
          </li>
          {SIDE_END.map(renderTab)}
        </ul>
      </div>
    </nav>
  );
}
