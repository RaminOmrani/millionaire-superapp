"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, MessageSquareText } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { BannerView } from "@/content/banners";
import { cn } from "@/lib/utils";

/**
 * Top promo slot: exactly ONE fixed banner — no rotation, dots or swipe. Receives the slot's candidates
 * in priority order and shows the first one meant for each surface; website and installed app are
 * switched purely by CSS (`app:` variant) so there is no flash.
 */
export function FixedBanner({ banners, size = "top", className }: { banners: BannerView[]; size?: "top" | "middle"; className?: string }) {
  const web = banners.find((b) => b.audience !== "app");
  const app = banners.find((b) => b.audience !== "web");
  if (web && web === app) return <BannerCard banner={web} size={size} priority className={className} />;
  return (
    <>
      {web && <BannerCard banner={web} size={size} priority className={cn("app:hidden", className)} />}
      {app && <BannerCard banner={app} size={size} priority className={cn("hidden app:block", className)} />}
    </>
  );
}

/**
 * Middle promo slot: horizontal scroll-snap carousel (swipe on phones), dots, gentle autoplay that pauses
 * on hover/touch and never runs with reduced motion. Each surface (website / installed app) gets its own
 * live banners, or the `fallback` house slides when none is live there. Renders nothing when both are empty.
 */
export function BannerCarousel({ banners, size = "top", className }: { banners: BannerView[]; size?: "top" | "middle"; className?: string }) {
  const live = banners.filter((b) => !b.fallback);
  const house = banners.filter((b) => b.fallback);
  const forSurface = (list: BannerView[]) => (list.length > 0 ? list : house);
  const web = forSurface(live.filter((b) => b.audience !== "app"));
  const app = forSurface(live.filter((b) => b.audience !== "web"));
  // Identical list for both surfaces → one carousel; otherwise two, switched purely by CSS (no flash).
  const same = web.length === app.length && web.every((b, i) => b === app[i]);
  if (same) return <Track banners={web} size={size} className={className} />;
  return (
    <>
      {web.length > 0 && <Track banners={web} size={size} className={cn("app:hidden", className)} />}
      {app.length > 0 && <Track banners={app} size={size} className={cn("hidden app:block", className)} />}
    </>
  );
}

function Track({ banners, size, className }: { banners: BannerView[]; size: "top" | "middle"; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const goTo = useCallback((i: number) => {
    // scrollIntoView handles RTL scroll offsets (negative scrollLeft) correctly.
    const slide = track.current?.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth || 1;
      setIndex(Math.round(Math.abs(el.scrollLeft) / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (paused.current || document.hidden) return;
      setIndex((i) => {
        const next = (i + 1) % banners.length;
        goTo(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [banners.length, goTo]);

  if (banners.length === 0) return null;

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="بنرها"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} از ${banners.length}`}
          >
            <BannerCard banner={b} size={size} priority={i === 0} />
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setIndex(i);
                goTo(i);
              }}
              aria-label={`بنر ${i + 1}`}
              aria-current={i === index}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-fg" : "w-1.5 bg-fg/25")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerCard({ banner: b, size, priority, className }: { banner: BannerView; size: "top" | "middle"; priority: boolean; className?: string }) {
  const imageOnly = !!b.image && !b.title && !b.subtitle;
  // Image banners keep a fixed ratio (artwork is cropped to it). Text banners in the slim top slot
  // grow to their content on phones instead, so a longer subline never runs into the button.
  const ratio =
    size === "top"
      ? b.image
        ? "aspect-[3.3/1] md:aspect-[5.2/1]"
        : "min-h-28 md:min-h-0 md:aspect-[5.2/1]"
      : "aspect-[2.05/1] md:aspect-[3.2/1]";
  // The slim top slot gives the text more room so the subline stays readable on a 390px phone.
  const visualWidth = size === "top" ? "w-[30%]" : "w-[38%]";
  const textWidth = size === "top" ? "max-w-[70%]" : "max-w-[62%]";

  const body = (
    <div
      className={cn(
        "group relative isolate flex h-full w-full rounded-[1.75rem] border bg-surface",
        "border-[color-mix(in_oklab,var(--accent)_40%,transparent)]",
        ratio,
      )}
      style={{ "--accent": b.accent, "--accent-2": b.accent2 } as CSSProperties}
    >
      <div aria-hidden={!b.image || undefined} className="grain absolute inset-0 -z-10 overflow-hidden rounded-[1.75rem]">
      {b.image ? (
        <Image
          src={b.image}
          alt={b.title ?? ""}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 640px) 100vw, 1024px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 140% at 100% 0%, color-mix(in oklab, var(--accent) 70%, transparent), transparent 60%)," +
                "radial-gradient(70% 120% at 0% 100%, color-mix(in oklab, var(--accent-2) 55%, transparent), transparent 65%)",
            }}
          />
          {(b.mark || b.icon) && (
            /* mark confined to the left side so it never sits under the text; straight, no shadow (designer) */
            <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center p-[3%]", visualWidth)}>
              {b.icon === "consult" ? (
                <MessageSquareText className="h-[58%] w-auto max-w-full text-fg/85" strokeWidth={1.4} />
              ) : (
                b.mark && (
                  <>
                    <Image src={b.mark} alt="" width={300} height={300} className={cn("max-h-[88%] w-auto max-w-full object-contain", b.markLight && "light:hidden")} />
                    {b.markLight && <Image src={b.markLight} alt="" width={300} height={300} className="hidden max-h-[88%] w-auto max-w-full object-contain light:block" />}
                  </>
                )
              )}
            </span>
          )}
        </>
      )}
      {b.image && !imageOnly && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-transparent" />
      )}
      </div>

      {!imageOnly && (b.title || b.subtitle) && (
        <>
          <div className={cn("flex flex-col justify-center gap-1 sm:gap-2", textWidth, size === "top" ? "p-3.5 sm:p-6" : "p-5 sm:p-8", b.image && "text-white")}>
            {b.title && <p className={cn("display text-balance leading-snug", size === "top" ? "text-base sm:text-xl lg:text-2xl" : "text-lg sm:text-2xl lg:text-3xl")}>{b.title}</p>}
            {b.subtitle && <p className={cn("text-xs sm:text-base", "text-pretty", size === "middle" ? "line-clamp-2" : b.image ? "line-clamp-1" : "line-clamp-3 sm:line-clamp-2", b.image ? "text-white/80" : "text-fg-muted")}>{b.subtitle}</p>}
            {b.href && b.ctaLabel && (
              <span
                className={cn(
                  "mt-1 inline-flex w-fit items-center gap-1.5 rounded-full font-bold sm:mt-2",
                  size === "top" ? "px-3 py-1 text-[11px] sm:px-4 sm:py-1.5 sm:text-sm" : "px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm",
                  b.image ? "bg-white text-black" : "bg-fg text-bg",
                )}
              >
                {b.ctaLabel}
                {b.external && <ArrowUpLeft className="size-3.5" aria-hidden />}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (!b.href) return className ? <div className={className}>{body}</div> : body;
  if (b.external)
    return (
      <a href={b.href} target="_blank" rel="noopener noreferrer" className={cn("block rounded-[1.75rem]", className)}>
        {body}
      </a>
    );
  return (
    <Link href={b.href} className={cn("block rounded-[1.75rem]", className)}>
      {body}
    </Link>
  );
}
