"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="display text-6xl text-fg-faint">خطا</p>
      <h1 className="display text-2xl">مشکلی پیش آمد</h1>
      <p className="max-w-sm text-sm text-fg-muted">
        لطفاً دوباره تلاش کنید. اگر تکرار شد، با پشتیبانی تماس بگیرید.
        {error.digest && <span className="ltr-nums mt-2 block text-xs text-fg-faint">کد: {error.digest}</span>}
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-bold text-bg">
          <RotateCcw className="size-4" aria-hidden />
          تلاش دوباره
        </button>
        <Link href="/" className="rounded-full border border-line px-6 py-3 font-bold">
          خانه
        </Link>
      </div>
    </main>
  );
}
