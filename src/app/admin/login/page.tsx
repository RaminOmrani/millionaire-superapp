import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";
import { holding } from "@/content/holding";

export const metadata: Metadata = { title: "ورود" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-tile border border-line bg-bg-elevated p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
        <Image src={holding.logo.horizontal} alt={holding.subtitle} width={1080} height={371} className="mx-auto h-12 w-auto" />
        <h1 className="display mt-6 text-center text-2xl">ورود به پنل مدیریت</h1>
        <p className="mt-1 text-center text-sm text-fg-muted">درخواست‌های مشاوره</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
