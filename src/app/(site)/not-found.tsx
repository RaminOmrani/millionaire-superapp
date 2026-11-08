import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { holding } from "@/content/holding";

export default function SiteNotFound() {
  return (
    <section className="grain relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 55% at 80% 20%, color-mix(in oklab, var(--color-brand-red) 40%, transparent), transparent 70%)",
        }}
      />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-32">
        <div>
          <p className="display text-[7rem] leading-none text-fg-faint sm:text-[10rem]">۴۰۴</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">این صفحه پیدا نشد</h1>
          <p className="mt-3 max-w-md text-fg-muted">
            شاید آدرس اشتباه تایپ شده یا این بخش هنوز عمومی نشده است.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-bold text-bg transition hover:opacity-90">
              <ArrowRight className="size-4" aria-hidden />
              بازگشت به خانه
            </Link>
            <Link href="/consult" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-bold transition hover:border-fg/30">
              <MessageSquareText className="size-4" aria-hidden />
              درخواست مشاوره
            </Link>
          </div>
        </div>
        <Image src={holding.logo.mark} alt="" width={909} height={1080} className="h-40 w-auto opacity-30 sm:h-56" aria-hidden />
      </div>
    </section>
  );
}
