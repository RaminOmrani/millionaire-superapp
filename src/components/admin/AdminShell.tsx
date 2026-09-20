import Image from "next/image";
import Link from "next/link";
import { BarChart3, Inbox, LogOut, Package, Settings } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "درخواست‌ها", icon: Inbox },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/stats", label: "آمار", icon: BarChart3 },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
] as const;

export function AdminShell({
  title,
  current,
  actions,
  children,
}: {
  title: string;
  current: (typeof NAV)[number]["href"];
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-bg-elevated">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3" aria-label="پنل مدیریت">
              <Image src={holding.logo.horizontal} alt={holding.subtitle} width={1080} height={371} className="h-8 w-auto" />
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="بخش‌ها">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                    current === item.href ? "bg-fg text-bg" : "text-fg-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full px-3 py-2 text-sm text-fg-muted hover:text-fg">
              سایت
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-medium hover:bg-bg"
              >
                <LogOut className="size-4" aria-hidden />
                خروج
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden" aria-label="بخش‌ها">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                current === item.href ? "bg-fg text-bg" : "text-fg-muted",
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="display text-2xl sm:text-3xl">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
