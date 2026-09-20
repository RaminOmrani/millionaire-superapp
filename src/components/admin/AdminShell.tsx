import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { holding } from "@/content/holding";

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-bg-elevated">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3" aria-label="پنل مدیریت">
            <Image src={holding.logo.horizontal} alt={holding.subtitle} width={1080} height={371} className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold text-fg-muted sm:inline">پنل مدیریت</span>
          </Link>
          <nav className="flex items-center gap-2">
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
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="display mb-6 text-2xl sm:text-3xl">{title}</h1>
        {children}
      </main>
    </div>
  );
}
