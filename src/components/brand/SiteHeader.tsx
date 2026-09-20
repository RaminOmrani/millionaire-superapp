import Image from "next/image";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { holding } from "@/content/holding";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label={holding.nameFa}>
          <Image
            src={holding.logo.horizontal}
            alt={holding.subtitle}
            width={1080}
            height={371}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="اصلی" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#products"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition hover:text-fg sm:inline-flex"
          >
            محصولات
          </Link>
          <Link
            href="/about"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition hover:text-fg sm:inline-flex"
          >
            درباره‌ی ما
          </Link>
          <Link
            href="/consult"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-[0_8px_30px_-10px_var(--color-brand-red)] transition hover:bg-brand-red-light active:scale-[0.98]"
          >
            <MessageSquareText className="size-4" aria-hidden />
            درخواست مشاوره
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
