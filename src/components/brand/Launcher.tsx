"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpLeft, Clock, History, Search, X } from "lucide-react";
import { ServiceIcon, type ServiceIconName } from "@/components/brand/ServiceIcon";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { clearRecent, useRecent } from "@/lib/local-store";
import { searchItems, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";

export interface LauncherProduct {
  slug: string;
  nameFa: string;
  shortName: string;
  locked: boolean;
  accent: string;
  mark: string;
  markLight?: string;
  /** Admin-set label, e.g. «جدید» */
  badge?: string;
}

interface Props {
  products: LauncherProduct[];
  index: SearchItem[];
  supportUrl: string;
  /** Rendered between the search box and the icon grid (promo banners) */
  topSlot?: React.ReactNode;
}

/** Super-app style entry: search first, then an icon grid of products and services. */
export function Launcher({ products, index, supportUrl, topSlot }: Props) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchItems(index, query), [index, query]);
  const recentSlugs = useRecent();
  const recent = recentSlugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is LauncherProduct => !!p);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      // «/» focuses search, like most app launchers
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    function onHash() {
      if (window.location.hash === "#search") {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    onHash();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function go(item: SearchItem) {
    setOpen(false);
    if (item.external || item.href.startsWith("tel:")) window.open(item.href, item.href.startsWith("tel:") ? "_self" : "_blank", "noopener");
    else router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) {
      if (e.key === "Escape") setQuery("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const services: Array<{ key: ServiceIconName; label: string; href: string; external?: boolean }> = [
    { key: "support", label: "پشتیبانی", href: supportUrl, external: true },
    { key: "consult", label: "مشاوره", href: "/consult" },
    { key: "about", label: "درباره ما", href: "/about" },
  ];

  const showPanel = open && query.trim().length > 0;

  return (
    <div className="space-y-7">
      {/* ---------- search ---------- */}
      <div ref={boxRef} id="search" className="relative z-30 scroll-mt-24">
        <label htmlFor="launcher-search" className="sr-only">
          جست‌وجو در محصولات و خدمات
        </label>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-surface px-4 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)] transition",
            showPanel ? "border-fg/30" : "border-line hover:border-fg/20",
          )}
        >
          <Search className="size-5 shrink-0 text-fg-faint" aria-hidden />
          <input
            ref={inputRef}
            id="launcher-search"
            type="search"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showPanel && results[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            placeholder="جست‌وجو در محصولات و خدمات"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-13 w-full min-w-0 bg-transparent text-base text-fg placeholder:text-sm placeholder:text-fg-faint focus:outline-none sm:h-14 sm:placeholder:text-base [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-bg hover:text-fg"
              aria-label="پاک کردن جست‌وجو"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded-md border border-line px-2 py-0.5 text-xs text-fg-faint sm:inline">/</kbd>
          )}
        </div>

        {showPanel && (
          <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-line bg-bg-elevated shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
            {results.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="نتایج جست‌وجو" className="max-h-[60vh] overflow-y-auto p-2">
                {results.map((item, i) => (
                  <li
                    key={item.id}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      go(item);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3",
                      i === active ? "bg-surface" : "hover:bg-surface",
                    )}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: item.accent ?? "var(--color-brand-red)" }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{item.title}</span>
                      {item.subtitle && <span className="block truncate text-xs text-fg-muted">{item.subtitle}</span>}
                    </span>
                    <span className="shrink-0 text-[11px] text-fg-faint">
                      {item.kind === "product" ? "محصول" : item.kind === "action" ? "دسترسی" : "صفحه"}
                    </span>
                    {item.external && <ArrowUpLeft className="size-4 shrink-0 text-fg-faint" aria-hidden />}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-fg-muted">
                نتیجه‌ای برای «{query}» پیدا نشد.
                <Link href="/consult" className="mt-2 block font-semibold text-fg underline-offset-4 hover:underline">
                  از کارشناسان ما بپرسید
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="-mt-3 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="اخیراً بازدیدشده">
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-fg-faint">
            <History className="size-3.5" aria-hidden />
            اخیراً
          </span>
          {recent.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface py-1 pe-3 ps-1 text-xs font-bold transition hover:border-fg/30"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-bg/60 p-1">
                <Image src={p.mark} alt="" width={24} height={24} className={cn("h-full w-full object-contain", p.markLight && "light:hidden")} />
                {p.markLight && <Image src={p.markLight} alt="" width={24} height={24} className="hidden h-full w-full object-contain light:block" />}
              </span>
              {p.shortName}
            </Link>
          ))}
          <button type="button" onClick={clearRecent} className="shrink-0 rounded-full px-2 py-1 text-[11px] text-fg-faint hover:text-fg" aria-label="پاک کردن اخیراً بازدیدشده">
            پاک کردن
          </button>
        </div>
      )}

      {topSlot}

      {/* ---------- icon grid ---------- */}
      <nav aria-label="محصولات و خدمات">
        <ul className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-8 sm:gap-x-4">
          {products.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/${p.slug}`}
                className="group relative flex flex-col items-center gap-2 rounded-2xl text-center"
                aria-label={`${p.nameFa}${p.badge ? ` — ${p.badge}` : ""}${p.locked ? " (به‌زودی)" : ""}`}
              >
                {p.badge && (
                  <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-[#e0393e] to-brand-red px-2 py-0.5 text-[10px] font-extrabold text-white shadow-[0_6px_14px_-6px_var(--color-brand-red)] ring-2 ring-bg">
                    {p.badge}
                  </span>
                )}
                <span
                  className={cn(
                    "grain relative flex aspect-square w-full max-w-[76px] items-center justify-center overflow-hidden rounded-[26%] border bg-surface p-[20%] transition duration-300 group-hover:-translate-y-0.5 group-active:scale-95",
                    "border-[color-mix(in_oklab,var(--accent)_35%,transparent)] shadow-[0_16px_40px_-24px_color-mix(in_oklab,var(--accent)_90%,transparent)]",
                    p.locked && "opacity-75 saturate-[0.6]",
                  )}
                  style={{ "--accent": p.accent } as CSSProperties}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                      background:
                        "radial-gradient(100% 90% at 100% 0%, color-mix(in oklab, var(--accent) calc(var(--tile-glow) * 90%), transparent), transparent 65%)",
                    }}
                  />
                  <Image src={p.mark} alt="" width={96} height={96} className={cn("h-full w-auto object-contain", p.markLight && "light:hidden")} />
                  {p.markLight && (
                    <Image src={p.markLight} alt="" width={96} height={96} className="hidden h-full w-auto object-contain light:block" />
                  )}
                  {p.locked && (
                    <span className="absolute bottom-1 left-1 inline-flex size-5 items-center justify-center rounded-full bg-bg/80 text-fg-muted">
                      <Clock className="size-3" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="line-clamp-1 text-xs font-semibold sm:text-sm">{p.shortName}</span>
              </Link>
            </motion.li>
          ))}
          {services.map((s, i) => {
            const inner = (
              <>
                <span className="grain relative flex aspect-square w-full max-w-[76px] items-center justify-center overflow-hidden rounded-[26%] border border-line bg-surface p-[22%] transition duration-300 group-hover:-translate-y-0.5 group-active:scale-95">
                  <ServiceIcon name={s.key} className="h-full w-full" />
                </span>
                <span className="line-clamp-1 text-xs font-semibold sm:text-sm">{s.label}</span>
              </>
            );
            return (
              <motion.li
                key={s.key}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + (products.length + i) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {s.external ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-center">
                    {inner}
                  </a>
                ) : (
                  <Link href={s.href} className="group flex flex-col items-center gap-2 text-center">
                    {inner}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
