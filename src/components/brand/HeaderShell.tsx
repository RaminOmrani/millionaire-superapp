"use client";

import { useEffect, useRef } from "react";

/**
 * Sticky header that stays flat at the very top and gains its divider + blurred background
 * only once the page has scrolled. Uses a 1px sentinel + IntersectionObserver (no scroll listener).
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const s = sentinel.current;
    if (!el || !s) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.scrolled = entry && !entry.isIntersecting ? "true" : "false";
    });
    io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <header
        ref={ref}
        data-scrolled="false"
        className="sticky top-0 z-40 border-b border-transparent bg-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg/80 data-[scrolled=true]:backdrop-blur-xl"
      >
        {children}
      </header>
    </>
  );
}
