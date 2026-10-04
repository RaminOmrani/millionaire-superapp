import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { holding } from "@/content/holding";
import { HeaderShell } from "@/components/brand/HeaderShell";
import { HoldingLogo } from "@/components/brand/HoldingLogo";
import { SideMenu } from "@/components/brand/SideMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:px-8 app:h-14">
        <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label={holding.nameFa}>
          <HoldingLogo priority className="h-9 w-auto sm:h-10 app:h-8" />
        </Link>

        <nav aria-label="اصلی" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#products"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition hover:text-fg sm:inline-flex app:hidden"
          >
            محصولات
          </Link>
          <Link
            href="/about"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition hover:text-fg sm:inline-flex app:hidden"
          >
            درباره ما
          </Link>
          <Link
            href="/consult"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-[0_8px_30px_-10px_var(--color-brand-red)] transition hover:bg-brand-red-light active:scale-[0.98] app:hidden"
          >
            <MessageSquareText className="size-4" aria-hidden />
            درخواست مشاوره
          </Link>
          {/* theme lives in the side menu on phones and in the app */}
          <ThemeToggle className="hidden sm:inline-flex app:hidden" />
          <SideMenu className="sm:hidden app:inline-flex" />
        </nav>
      </div>
    </HeaderShell>
  );
}
