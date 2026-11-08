"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Collapsed preview with a fade; «مشاهده‌ی همه» reveals the full content.
 * The toggle only appears when the content is actually taller than the preview.
 */
export function Expandable({ children, collapsedHeight = 220 }: { children: React.ReactNode; collapsedHeight?: number }) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const inner = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > collapsedHeight + 24);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsedHeight]);

  const clipped = overflows && !open;

  return (
    <div>
      <div
        id={id}
        className={cn("relative overflow-hidden", clipped && "[mask-image:linear-gradient(to_bottom,black_60%,transparent)]")}
        style={{ maxHeight: clipped ? collapsedHeight : undefined }}
      >
        <div ref={inner}>{children}</div>
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/40 px-4 py-2 text-sm font-bold transition hover:border-fg/30"
        >
          {open ? "بستن" : "مشاهده‌ی همه"}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      )}
    </div>
  );
}
