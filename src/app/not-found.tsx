import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="display text-7xl">۴۰۴</p>
      <p className="text-fg-muted">صفحه‌ای که دنبالش بودید پیدا نشد.</p>
      <Link href="/" className="rounded-full bg-fg px-6 py-3 font-bold text-bg">
        بازگشت به خانه
      </Link>
    </main>
  );
}
