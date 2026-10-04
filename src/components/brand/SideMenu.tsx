"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { ArrowUpLeft, Bell, Download, Home, Info, LayoutGrid, LifeBuoy, Mail, Menu, MessageSquareText, Phone, Share, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HoldingLogoClient } from "@/components/brand/HoldingLogoClient";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { holding } from "@/content/holding";
import { markNewsSeen, useNewsSeenAt } from "@/lib/local-store";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: number;
  title: string;
  subtitle?: string | null;
  href?: string | null;
  external: boolean;
  audience: "both" | "web" | "app";
  at: number;
}

const NAV = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/#search", label: "جست‌وجو در محصولات", icon: LayoutGrid },
  { href: "/consult", label: "درخواست مشاوره", icon: MessageSquareText },
  { href: "/about", label: "درباره ما", icon: Info },
] as const;

const noopSubscribe = () => () => {};

/**
 * Side drawer (hamburger, like Snapp): navigation, theme, contact, socials, install, and «تازه‌ها»
 * (titled live banners). A red dot marks news newer than the last time the menu was opened.
 */
export function SideMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [iosHint, setIosHint] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const seenAt = useNewsSeenAt();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    let alive = true;
    fetch("/api/news", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items: NewsItem[] }) => alive && setNews(d.items ?? []))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const isApp = mounted && document.documentElement.dataset.app === "1";
  const visibleNews = news.filter((n) => n.audience === "both" || (isApp ? n.audience === "app" : n.audience === "web"));
  const latest = visibleNews.reduce((m, n) => Math.max(m, n.at), 0);
  const unread = latest > seenAt;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    if (latest) markNewsSeen(latest);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const body = document.body;
    const prev = body.style.getPropertyValue("overflow");
    body.style.setProperty("overflow", "hidden");
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.setProperty("overflow", prev);
    };
  }, [open, latest, close]);

  async function install() {
    const w = window as unknown as { __installPrompt?: Event & { prompt: () => Promise<void> } };
    if (w.__installPrompt) {
      await w.__installPrompt.prompt();
      w.__installPrompt = undefined;
    } else {
      setIosHint(true);
    }
  }

  const drawer = (
    <div className={cn("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={close}
        className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="منو"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto border-r border-line bg-bg-elevated/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <HoldingLogoClient className="h-9 w-auto" />
          <button type="button" onClick={close} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg-muted hover:text-fg" aria-label="بستن منو">
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <nav className="px-3 py-3" aria-label="منو">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-bold transition hover:bg-surface",
                    pathname === n.href && "bg-surface",
                  )}
                >
                  <n.icon className="size-5 text-fg-muted" aria-hidden />
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={holding.supportCenter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-bold transition hover:bg-surface">
                <LifeBuoy className="size-5 text-fg-muted" aria-hidden />
                مرکز پشتیبانی
                <ArrowUpLeft className="ms-auto size-4 text-fg-faint" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>

        <section className="mx-3 rounded-2xl border border-line bg-surface/60 p-4">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Bell className="size-4 text-[#ff7a7a] light:text-brand-red" aria-hidden />
            تازه‌ها
          </h2>
          {visibleNews.length === 0 ? (
            <p className="mt-2 text-xs text-fg-muted">فعلاً خبر تازه‌ای نیست.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {visibleNews.map((n) => {
                const body = (
                  <>
                    <span className="block font-semibold">{n.title}</span>
                    {n.subtitle && <span className="block text-xs text-fg-muted">{n.subtitle}</span>}
                  </>
                );
                return (
                  <li key={n.id} className="rounded-xl bg-bg/40 px-3 py-2 text-sm">
                    {n.href ? (
                      n.external ? (
                        <a href={n.href} target="_blank" rel="noopener noreferrer" className="block">
                          {body}
                        </a>
                      ) : (
                        <Link href={n.href} onClick={close} className="block">
                          {body}
                        </Link>
                      )
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface/60 px-4 py-3">
          <span className="text-sm font-bold">حالت نمایش</span>
          <ThemeToggle />
        </div>

        {!isApp && (
          <div className="mx-3 mt-3 rounded-2xl border border-line bg-surface/60 p-4">
            <button type="button" onClick={install} className="flex w-full items-center gap-3 text-sm font-bold">
              <Download className="size-5 text-fg-muted" aria-hidden />
              نصب اپ روی گوشی
            </button>
            {iosHint && (
              <p className="mt-2 text-xs leading-6 text-fg-muted">
                در مرورگر دکمه‌ی <Share className="inline size-3.5 align-[-2px]" aria-label="اشتراک‌گذاری" /> را بزنید و «Add to Home Screen» را انتخاب کنید.
              </p>
            )}
          </div>
        )}

        <div className="mt-auto space-y-3 px-5 py-5 text-sm">
          <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="flex items-center gap-3 text-fg-muted hover:text-fg">
            <Phone className="size-4" aria-hidden />
            <span className="ltr-nums">{toPersianDigits(holding.phone)}</span>
          </a>
          <a href={`mailto:${holding.email}`} className="flex items-center gap-3 text-fg-muted hover:text-fg">
            <Mail className="size-4" aria-hidden />
            <span className="ltr-nums">{holding.email}</span>
          </a>
          <SocialLinks withLabels className="pt-2" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={unread ? "منو (خبر تازه)" : "منو"}
        aria-expanded={open}
        className={cn(
          "relative inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/60 text-fg-muted transition hover:border-fg/30 hover:text-fg",
          className,
        )}
      >
        <Menu className="size-[18px]" aria-hidden />
        {unread && (
          <span className="absolute right-1.5 top-1.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff4d4d] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#ff4d4d] ring-2 ring-bg" />
          </span>
        )}
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
