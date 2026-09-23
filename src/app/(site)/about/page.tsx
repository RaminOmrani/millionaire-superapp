import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, Clock, ExternalLink, Mail, MapPin, Phone, User } from "lucide-react";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { holding } from "@/content/holding";
import { getResolvedProducts } from "@/content/resolve";
import { toPersianDigits } from "@/lib/persian-digits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره‌ی هلدینگ",
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-4 text-sm font-semibold text-fg-muted">{holding.subtitle}</p>
              <h1 className="display text-balance text-4xl sm:text-5xl lg:text-6xl">{holding.nameFa}</h1>
              <p className="display mt-4 text-xl text-fg-muted sm:text-2xl">{holding.slogan}</p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-fg-muted sm:text-lg">
                {holding.nameFa} از سال {toPersianDigits(holding.foundedYear)} در حوزه‌ی {holding.field} فعالیت می‌کند و امروز با
                بیش از {toPersianDigits(holding.customers)} کسب‌وکار در سراسر کشور همکاری دارد. دفتر مرکزی ما در{" "}
                {holding.city} است.
              </p>
            </div>
            <div className="lg:col-span-5">
              <Image src={holding.logo.vertical} alt={holding.subtitle} width={967} height={1080} className="mx-auto h-48 w-auto sm:h-64" />
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="grain rounded-tile border border-line bg-surface p-6">
                <dd className="display text-4xl sm:text-5xl">{f.value}</dd>
                <dt className="mt-2 text-sm text-fg-muted">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
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
                <a
                  href={holding.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-xs font-bold text-bg hover:opacity-90"
                >
                  <Building2 className="size-3.5" aria-hidden />
                  مسیریابی با نشان
                  <ExternalLink className="size-3" aria-hidden />
                </a>
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
