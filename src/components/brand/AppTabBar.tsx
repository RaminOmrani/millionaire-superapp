"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, LifeBuoy, MessageSquareText, Search } from "lucide-react";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home", label: "خانه", href: "/", icon: Home },
  { key: "search", label: "جست‌وجو", href: "/#search", icon: Search },
  { key: "consult", label: "مشاوره", href: "/consult", icon: MessageSquareText },
  { key: "support", label: "پشتیبانی", href: holding.supportCenter, icon: LifeBuoy, external: true },
  { key: "about", label: "درباره", href: "/about", icon: Info },
] as const;

/** Bottom tab bar — installed app only (hidden on the website via the `app:` variant). */
export function AppTabBar() {
  const pathname = usePathname();

  const isActive = (key: string, href: string) => {
    if (key === "home") return pathname === "/";
    if (key === "search") return false;
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="نوار اپ"
      className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl app:block"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = isActive(t.key, t.href);
          const cls = cn(
            "flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[11px] font-semibold transition active:scale-95",
            active ? "text-fg" : "text-fg-faint hover:text-fg-muted",
          );
          const inner = (
            <>
              <span
                className={cn(
                  "inline-flex h-7 w-12 items-center justify-center rounded-full transition",
                  active && "bg-brand-red/20 text-brand-red-light light:bg-brand-red/10 light:text-brand-red",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              {t.label}
            </>
          );
          return (
            <li key={t.key}>
              {"external" in t && t.external ? (
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
        })}
      </ul>
    </nav>
  );
}
