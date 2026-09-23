import Link from "next/link";
import { ArrowDown, MessageSquareText } from "lucide-react";
import { HeroVisual } from "@/components/brand/HeroVisual";
import { BannerCarousel } from "@/components/brand/BannerCarousel";
import { Launcher, type LauncherProduct } from "@/components/brand/Launcher";
import { getLiveBanners } from "@/content/banners";
import { ProductGrid } from "@/components/product/ProductGrid";
import { holding } from "@/content/holding";
import { getResolvedProducts } from "@/content/resolve";
import { buildSearchIndex } from "@/content/search-index";
import { currentJalaliYear } from "@/lib/format";
import { toPersianDigits } from "@/lib/persian-digits";

// Content can be edited from /admin, so render per request (SQLite read is sub-millisecond).
export const dynamic = "force-dynamic";

/** Short labels under the launcher icons (full names are too long for a 4-column phone grid). */
const SHORT_NAMES: Record<string, string> = {
  millionaire: "حسابداری",
  crm: "CRM",
  shopmojahaz: "شاپ مجهز",
  menuclub: "منوکلاب",
  garson: "گارسون‌یار",
};

export default function LandingPage() {
  const products = getResolvedProducts();
  const activeCount = products.filter((p) => p.status === "active").length;
  const topBanners = getLiveBanners("top");
  const yearsActive = currentJalaliYear() - Number(holding.foundedYear);
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: holding.nameFa,
    alternateName: holding.nameEn,
    url: `https://${holding.appDomain}`,
    logo: `https://${holding.appDomain}/icons/icon-512.png`,
    email: holding.email,
    telephone: holding.phone,
    foundingDate: "2006",
    address: {
      "@type": "PostalAddress",
      streetAddress: holding.address,
      addressLocality: holding.city,
      postalCode: holding.postalCode,
      addressCountry: "IR",
    },
    sameAs: [holding.website, holding.social.instagram, holding.social.aparat],
  };
  const midBanners = getLiveBanners("middle");
  const launcherProducts: LauncherProduct[] = products.map((p) => ({
    slug: p.slug,
    nameFa: p.nameFa,
    shortName: SHORT_NAMES[p.slug] ?? p.nameFa,
    locked: p.status !== "active",
    accent: p.accent.primary,
    mark: p.logo.mark,
    markLight: p.logo.markLight,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {/* ---------- Launcher: search + icons first (super-app pattern) ---------- */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 0%, color-mix(in oklab, var(--color-brand-red) 30%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-12 lg:px-8 app:pt-5">
          <p className="mb-3 text-sm font-semibold text-fg-muted sm:mb-4 sm:text-base">
            <span className="app:hidden">به پورتال {holding.nameFa} خوش آمدید</span>
            <span className="hidden app:inline">سلام؛ امروز سراغ کدام محصول می‌روید؟</span>
          </p>
          <Launcher
            products={launcherProducts}
            index={buildSearchIndex(products)}
            supportUrl={holding.supportCenter}
            topSlot={topBanners.length > 0 ? <BannerCarousel banners={topBanners} size="top" /> : null}
          />
        </div>
      </section>

      {/* ---------- Mid-page promo slot (admin-managed; renders nothing when empty) ---------- */}
      {midBanners.length > 0 && (
        <section className="mx-auto mt-10 max-w-5xl px-4 sm:mt-14 sm:px-6 lg:px-8">
          <BannerCarousel banners={midBanners} size="middle" />
        </section>
      )}

      {/* ---------- Banner ---------- */}
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:mt-14 sm:px-6 lg:px-8 app:hidden">
        <div className="grain relative overflow-hidden rounded-[2rem] border border-line bg-surface">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(70% 90% at 100% 0%, color-mix(in oklab, var(--color-brand-red) 45%, transparent), transparent 65%)," +
                "radial-gradient(50% 70% at 0% 100%, color-mix(in oklab, var(--color-brand-red-deep) 40%, transparent), transparent 70%)",
            }}
          />
          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
            <div className="lg:col-span-7">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted">
                <span className="size-1.5 rounded-full bg-brand-red" aria-hidden />
                {holding.subtitle}، از سال {toPersianDigits(holding.foundedYear)}
              </p>
              <h1 className="display text-balance text-3xl leading-[1.15] sm:text-5xl lg:text-6xl">{holding.slogan}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-fg-muted sm:text-lg">
                همه‌ی محصولات {holding.nameFa}، یک‌جا. محصول خود را انتخاب کنید و به پنل، پشتیبانی و تعرفه‌های آن
                دسترسی داشته باشید.
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <dd className="display text-3xl sm:text-4xl">+{toPersianDigits(holding.customers)}</dd>
                  <dt className="text-sm text-fg-muted">کسب‌وکار همکار در سراسر کشور</dt>
                </div>
                <div>
                  <dd className="display text-3xl sm:text-4xl">+{toPersianDigits(yearsActive)}</dd>
                  <dt className="text-sm text-fg-muted">سال تجربه</dt>
                </div>
                <div>
                  <dd className="display text-3xl sm:text-4xl">{toPersianDigits(activeCount)}</dd>
                  <dt className="text-sm text-fg-muted">محصول فعال</dt>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-base font-bold text-bg transition hover:opacity-90 active:scale-[0.98]"
                >
                  مشاهده‌ی محصولات
                  <ArrowDown className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/consult"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/40 px-6 py-3 text-base font-bold transition hover:border-fg/30 active:scale-[0.98]"
                >
                  <MessageSquareText className="size-4" aria-hidden />
                  درخواست مشاوره
                </Link>
              </div>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <HeroVisual className="mx-auto max-w-[400px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Products ---------- */}
      <section id="products" className="mt-16 scroll-mt-24 sm:mt-24 app:mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 max-w-2xl sm:mb-10 app:mb-5">
            <p className="text-sm font-bold text-brand-red-light light:text-brand-red">محصولات هلدینگ</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">یک برند برای هر نیاز</h2>
            <p className="mt-3 text-base leading-8 text-fg-muted app:hidden">
              هر محصول، یک برند مستقل زیر یک سقف است. برای ورود به پنل، پشتیبانی و تعرفه‌ها روی کارت هر محصول بزنید.
            </p>
          </header>
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
