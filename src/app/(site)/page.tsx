import Link from "next/link";
import { ArrowDown, MessageSquareText } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { holding } from "@/content/holding";
import { getResolvedProducts } from "@/content/resolve";
import { toPersianDigits } from "@/lib/persian-digits";

// Content can be edited from /admin, so render per request (SQLite read is sub-millisecond).
export const dynamic = "force-dynamic";

export default function LandingPage() {
  const products = getResolvedProducts();
  const activeCount = products.filter((p) => p.status === "active").length;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 85% 10%, color-mix(in oklab, var(--color-brand-red) 45%, transparent), transparent 70%)," +
              "radial-gradient(45% 40% at 10% 90%, color-mix(in oklab, var(--color-brand-red-deep) 40%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "color-mix(in oklab, var(--color-brand-red) 35%, transparent)" }}
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-fg-muted">
                <span className="size-1.5 rounded-full bg-brand-red" aria-hidden />
                {holding.subtitle}
              </p>
              <h1 className="display text-balance text-[2.6rem] leading-[1.1] sm:text-6xl lg:text-7xl">
                {holding.slogan}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-fg-muted sm:text-xl">
                همه‌ی محصولات {holding.nameFa}، یک‌جا. محصول خود را انتخاب کنید و به پنل، پشتیبانی و
                تعرفه‌های آن دسترسی داشته باشید.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-base font-bold text-bg transition hover:opacity-90 active:scale-[0.98]"
                >
                  محصولات
                  <ArrowDown className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/consult"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-6 py-3 text-base font-bold transition hover:border-fg/30 active:scale-[0.98]"
                >
                  <MessageSquareText className="size-4" aria-hidden />
                  درخواست مشاوره
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm lg:col-span-4 lg:border-t-0 lg:border-r lg:pr-8 lg:pt-0">
              <div>
                <dt className="text-fg-faint">محصولات فعال</dt>
                <dd className="display mt-1 text-4xl">{toPersianDigits(activeCount)}</dd>
              </div>
              <div>
                <dt className="text-fg-faint">به‌زودی</dt>
                <dd className="display mt-1 text-4xl">{toPersianDigits(products.length - activeCount)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-fg-faint">مرکز پشتیبانی مشترک</dt>
                <dd className="mt-1">
                  <a
                    href={holding.supportCenter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ltr-nums font-semibold underline-offset-4 hover:underline"
                  >
                    support.softmiliac.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Products ---------- */}
      <section id="products" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
            <h2 className="display text-3xl sm:text-4xl">محصولات</h2>
            <p className="max-w-xs text-sm text-fg-muted">
              هر محصول، یک برند مستقل زیر یک سقف. برای ورود، روی کارت بزنید.
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
