import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { HoldingLogo } from "@/components/brand/HoldingLogo";
import { MapButton } from "@/components/ui/MapButton";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { holding } from "@/content/holding";
import { getResolvedProducts } from "@/content/resolve";
import { toPersianDigits } from "@/lib/persian-digits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `${holding.nameFa} — فعال در حوزه‌ی ${holding.field} از سال ${toPersianDigits(holding.foundedYear)}، همکار بیش از ${toPersianDigits(holding.customers)} کسب‌وکار در سراسر کشور.`,
};

export default function AboutPage() {
  const products = getResolvedProducts();
  const facts = [
    { value: toPersianDigits(holding.foundedYear), label: "سال تأسیس" },
    { value: `+${toPersianDigits(holding.customers)}`, label: "کسب‌وکار همکار در سراسر کشور" },
    { value: toPersianDigits(products.length), label: "محصول زیر یک سقف" },
  ];

  return (
    <>
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 90% 0%, color-mix(in oklab, var(--color-brand-red) 40%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* logo first (Ramin): top on phones, right column on desktop */}
            <div className="lg:col-span-4">
              <HoldingLogo variant="vertical" className="mx-auto h-40 w-auto sm:h-52" />
            </div>
            <div className="lg:col-span-8">
              <p className="mb-3 text-sm font-semibold text-fg-muted">{holding.subtitle}</p>
              <h1 className="display text-balance text-3xl sm:text-4xl lg:text-5xl">{holding.nameFa}</h1>
              <p className="display mt-3 text-lg text-fg-muted sm:text-xl">{holding.slogan}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-fg-muted">
                {holding.nameFa} از سال {toPersianDigits(holding.foundedYear)} در حوزه‌ی {holding.field} فعالیت می‌کند و امروز با
                بیش از {toPersianDigits(holding.customers)} کسب‌وکار در سراسر کشور همکاری دارد. دفتر مرکزی ما در{" "}
                {holding.city} است.
              </p>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            {facts.map((f) => (
              <div key={f.label} className="grain flex flex-col items-center rounded-tile border border-line bg-surface px-2 py-5 text-center sm:p-6">
                <dd className="display text-2xl sm:text-4xl">{f.value}</dd>
                <dt className="mt-2 text-xs leading-5 text-fg-muted sm:text-sm">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="grain rounded-tile border border-line bg-surface p-6 lg:col-span-5">
            <h2 className="display text-2xl">تماس</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Row icon={User} label="مدیرعامل">{holding.ceo}</Row>
              <Row icon={Phone} label="تلفن">
                <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="ltr-nums font-semibold">
                  {toPersianDigits(holding.phone)}
                </a>
              </Row>
              <Row icon={Mail} label="ایمیل">
                <a href={`mailto:${holding.email}`} className="ltr-nums font-semibold">
                  {holding.email}
                </a>
              </Row>
              <Row icon={Clock} label="ساعت کاری">{holding.workingHours}</Row>
              <Row icon={MapPin} label="آدرس">
                <p className="leading-7">{holding.address}</p>
                <p className="mt-1 text-fg-muted">
                  کد پستی: <span className="ltr-nums">{toPersianDigits(holding.postalCode)}</span>
                </p>
                <MapButton size="sm" className="mt-3" />
              </Row>
            </dl>
            <div className="mt-6 border-t border-line pt-5">
              <p className="mb-3 text-sm text-fg-faint">ما را دنبال کنید</p>
              <SocialLinks withLabels />
            </div>
          </div>

          <div className="grain rounded-tile border border-line bg-surface p-6 lg:col-span-7">
            <h2 className="display text-2xl">محصولات هلدینگ</h2>
            <ul className="mt-5 divide-y divide-line">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="flex items-center justify-between gap-4 py-3 transition hover:text-fg"
                    style={{ "--accent": p.accent.primary } as React.CSSProperties}
                  >
                    <span className="flex items-center gap-3">
                      <span className="size-2.5 rounded-full bg-[var(--accent)]" aria-hidden />
                      <span className="font-semibold">{p.nameFa}</span>
                      <span className="hidden text-sm text-fg-muted sm:inline">{p.tagline}</span>
                    </span>
                    <span className="text-xs text-fg-faint">{p.status === "active" ? "فعال" : "به‌زودی"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
      <div>
        <dt className="text-fg-faint">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}
