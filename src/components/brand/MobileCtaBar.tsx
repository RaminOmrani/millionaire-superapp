"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";
import { holding } from "@/content/holding";

/** Thumb-reach actions on phones; hidden on the consult page itself. */
export function MobileCtaBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/consult")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] sm:hidden app:hidden">
      <div className="pointer-events-auto relative mx-auto grid max-w-md grid-cols-2 gap-2 rounded-[1.6rem] border border-white/10 bg-[color-mix(in_oklab,var(--surface)_62%,transparent)] p-2 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 light:border-black/5 light:bg-white/70 light:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25)]">
        <a
          href={`tel:${holding.phone.replace(/-/g, "")}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-bg/40 px-4 py-3 text-sm font-bold active:scale-[0.98]"
        >
          <Phone className="size-4" aria-hidden />
          تماس
        </a>
        <Link
          href="/consult"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#c42a2a] to-brand-red-deep px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_var(--color-brand-red)] active:scale-[0.98]"
        >
          <MessageSquareText className="size-4" aria-hidden />
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}
