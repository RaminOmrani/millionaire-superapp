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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/85 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden app:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${holding.phone.replace(/-/g, "")}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-3 text-sm font-bold"
        >
          <Phone className="size-4" aria-hidden />
          تماس
        </a>
        <Link
          href="/consult"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-3 text-sm font-bold text-white"
        >
          <MessageSquareText className="size-4" aria-hidden />
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}
