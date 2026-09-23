"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { BannerView } from "@/content/banners";
import { cn } from "@/lib/utils";

/**
 * Promo slot: horizontal scroll-snap carousel (swipe on phones), dots, gentle autoplay that pauses
 * on hover/touch and never runs with reduced motion. Renders nothing when there are no banners.
 */
export function BannerCarousel({ banners, size = "top", className }: { banners: BannerView[]; size?: "top" | "middle"; className?: string }) {
  const web = banners.filter((b) => b.audience !== "app");
  const app = banners.filter((b) => b.audience !== "web");
  // Same list for both surfaces → one carousel; otherwise two, switched purely by CSS (no flash).
  if (web.length === app.length) return <Track banners={banners} size={size} className={className} />;
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

function BannerCard({ banner: b, size, priority }: { banner: BannerView; size: "top" | "middle"; priority: boolean }) {
  const imageOnly = !!b.image && !b.title && !b.subtitle;
  const ratio = size === "top" ? "aspect-[2.6/1] md:aspect-[4.2/1]" : "aspect-[2/1] md:aspect-[3.4/1]";

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
          {b.mark && (
            <span aria-hidden className="pointer-events-none absolute -bottom-[18%] left-[4%] h-[125%] opacity-90">
              <Image src={b.mark} alt="" width={300} height={300} className={cn("h-full w-auto rotate-[-8deg] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]", b.markLight && "light:hidden")} />
              {b.markLight && <Image src={b.markLight} alt="" width={300} height={300} className="hidden h-full w-auto rotate-[-8deg] object-contain light:block" />}
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
          <div className={cn("flex max-w-[64%] flex-col justify-center gap-1.5 p-4 sm:gap-2 sm:p-7", b.image && "text-white")}>
            {b.title && <p className="display text-balance text-lg leading-snug sm:text-2xl lg:text-3xl">{b.title}</p>}
            {b.subtitle && <p className={cn("line-clamp-2 text-xs sm:text-base", b.image ? "text-white/80" : "text-fg-muted")}>{b.subtitle}</p>}
            {b.href && b.ctaLabel && (
              <span
                className={cn(
                  "mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold sm:mt-2 sm:px-5 sm:py-2 sm:text-sm",
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

  if (!b.href) return body;
  if (b.external)
    return (
      <a href={b.href} target="_blank" rel="noopener noreferrer" className="block rounded-[1.75rem]">
        {body}
      </a>
    );
  return (
    <Link href={b.href} className="block rounded-[1.75rem]">
      {body}
    </Link>
  );
}
