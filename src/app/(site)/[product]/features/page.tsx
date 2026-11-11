import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpLeft, Check, Clock, Lock, MessageSquareText, Sparkles } from "lucide-react";
import { PricingPlans } from "@/components/product/PricingPlans";
import { getProduct } from "@/content/products";
import { getResolvedProduct, type ResolvedProduct } from "@/content/resolve";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

type Params = Promise<{ product: string }>;

// Content is editable from /admin → render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).product;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `امکانات و سطح‌بندی ${product.nameFa}`,
    description: product.description ?? product.tagline,
    alternates: { canonical: `/${slug}/features` },
    openGraph: { images: [`/og/${slug}.png`] },
  };
}

export default async function ProductFeaturesPage({ params }: { params: Params }) {
  const slug = (await params).product;
  const product = getResolvedProduct(slug);
  if (!product) notFound();

  const pricing = product.actions.find((a) => a.key === "pricing");
  const plans = pricing?.plans ?? [];
  const packageNames = plans.length === 0 ? (pricing?.content ?? []) : [];
  const storeHref = pricing?.enabled && pricing.href && /^https?:\/\//.test(pricing.href) ? pricing.href : undefined;
  // Admin-entered features override the data.md grouped list (same rule as before on the hub).
  const groups = product.features.length === 0 ? (product.featureGroups ?? []) : [];
  const highlights = product.highlights ?? [];

  const sections: { id: string; label: string }[] = [
    { id: "about", label: "معرفی" },
    ...(highlights.length ? [{ id: "why", label: `چرا ${product.nameFa}؟` }] : []),
    { id: "features", label: "امکانات" },
    { id: "tiers", label: "سطح‌بندی و پکیج‌ها" },
  ];
  const num = (id: string) => toPersianDigits(String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0"));

  return (
    <div
      className="relative"
      style={
        {
          "--accent": product.accent.primary,
          "--accent-2": product.accent.secondary,
          "--glow": product.accent.glow ?? product.accent.primary,
        } as React.CSSProperties
      }
    >
      {/* ---------- Header ---------- */}
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 70% at 0% 0%, color-mix(in oklab, var(--glow) 40%, transparent), transparent 70%)," +
              "radial-gradient(45% 50% at 100% 100%, color-mix(in oklab, var(--accent-2) 30%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10 app:pb-8 app:pt-4">
          <Link
            href={`/${product.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition hover:text-fg"
          >
            <ArrowRight className="size-4" aria-hidden />
            بازگشت به {product.nameFa}
          </Link>

          <div className="mt-8 flex items-start gap-5 sm:items-center sm:gap-7 app:mt-5">
            <div className="grain flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--glow)_40%,transparent)] bg-surface p-3 sm:size-28 sm:p-4">
              <Image
                src={product.logo.mark}
                alt={`نشان ${product.nameFa}`}
                width={160}
                height={160}
                priority
                className={cn("h-full w-auto object-contain", product.logo.markLight && "light:hidden")}
              />
              {product.logo.markLight && (
                <Image
                  src={product.logo.markLight}
                  alt=""
                  aria-hidden
                  width={160}
                  height={160}
                  className="hidden h-full w-auto object-contain light:block"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-wide text-fg-muted">امکانات و سطح‌بندی</p>
              <h1 className="display mt-1 text-balance text-3xl sm:text-5xl lg:text-6xl">{product.nameFa}</h1>
              <p className="mt-2 text-base text-fg-muted sm:text-lg">{product.tagline}</p>
            </div>
          </div>

          {/* in-page index */}
          <nav aria-label="بخش‌های این صفحه" className="mt-8 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-sm font-semibold text-fg-muted transition hover:border-[color-mix(in_oklab,var(--glow)_60%,transparent)] hover:text-fg"
              >
                <span className="ltr-nums text-xs text-fg-faint">{num(s.id)}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12 pt-10 sm:space-y-20 sm:px-6 lg:px-8 lg:pt-14">
        {/* ---------- 1. Full description ---------- */}
        <Section id="about" num={num("about")} title="معرفی">
          {product.description ? (
            <p className="max-w-3xl text-lg leading-9 text-fg sm:text-xl sm:leading-10">{product.description}</p>
          ) : (
            <LockedPlaceholder label="معرفی" />
          )}
        </Section>

        {/* ---------- 2. Highlights ---------- */}
        {highlights.length > 0 && (
          <Section id="why" num={num("why")} title={`چرا ${product.nameFa}؟`}>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h) => {
                const [head, ...rest] = h.split(" — ");
                return (
                  <li key={h} className="grain relative overflow-hidden rounded-tile border border-line bg-surface p-5">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full opacity-60 blur-2xl"
                      style={{ background: "color-mix(in oklab, var(--glow) 35%, transparent)" }}
                    />
                    <p className="relative flex items-center gap-2 font-bold">
                      <Sparkles className="size-4 shrink-0 text-fg" aria-hidden />
                      {head}
                    </p>
                    {rest.length > 0 && <p className="relative mt-2 text-sm leading-7 text-fg-muted">{rest.join(" — ")}</p>}
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {/* ---------- 3. Features ---------- */}
        <Section id="features" num={num("features")} title="امکانات">
          {groups.length > 0 ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {groups.map((g, gi) => (
                <section key={g.title} className="grain relative break-inside-avoid overflow-hidden rounded-tile border border-line bg-surface p-5">
                  <p className="ltr-nums text-xs font-bold text-fg-faint">{toPersianDigits(String(gi + 1).padStart(2, "0"))}</p>
                  <h3 className="mt-1 text-lg font-bold">{g.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {g.items.map((it) => (
                      <li key={it.text} className="flex items-start gap-2">
                        <Check className="mt-1 size-3.5 shrink-0 text-fg" aria-hidden />
                        <span className={cn("leading-7", it.soon ? "text-fg-faint" : "text-fg-muted")}>
                          {it.text}
                          {it.soon && <SoonChip />}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : product.features.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((item) => (
                <li
                  key={item}
                  className="grain relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-4 font-semibold"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--glow)_50%,transparent)] bg-[color-mix(in_oklab,var(--glow)_14%,transparent)]">
                    <Check className="size-4 text-fg" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <LockedPlaceholder label="فهرست امکانات" />
          )}
        </Section>

        {/* ---------- 4. Tiers & packages ---------- */}
        <Section id="tiers" num={num("tiers")} title="سطح‌بندی و پکیج‌ها">
          {plans.length > 0 ? (
            <PricingPlans plans={plans} note={pricing?.note} />
          ) : packageNames.length > 0 ? (
            <div className="space-y-5">
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {packageNames.map((name) => (
                  <li
                    key={name}
                    className="grain relative flex min-h-24 flex-col justify-between overflow-hidden rounded-tile border border-line bg-surface p-4 sm:p-5"
                  >
                    <span className="font-bold">{name}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-faint">
                      <Lock className="size-3" aria-hidden />
                      به‌زودی
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                {pricing?.note && (
                  <p className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                    <Lock className="size-3.5" aria-hidden />
                    {pricing.note}
                  </p>
                )}
                {storeHref && (
                  <a
                    href={storeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ltr-nums inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold transition hover:bg-fg hover:text-bg"
                  >
                    {storeHref.replace(/^https?:\/\//, "")}
                    <ArrowUpLeft className="size-3.5" aria-hidden />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <LockedPlaceholder label="سطح‌بندی و پکیج‌ها" />
          )}
        </Section>

        {/* ---------- Version + motto ---------- */}
        {(product.version || product.motto) && <Closing product={product} />}

        {/* ---------- Consult CTA ---------- */}
        <ConsultCta product={product} />
      </div>
    </div>
  );
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 grid gap-6 lg:grid-cols-12 lg:gap-10">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-28">
          <span className="ltr-nums block text-sm font-bold text-fg-faint">{num}</span>
          <h2 id={`${id}-title`} className="display mt-1 text-2xl sm:text-3xl">
            {title}
          </h2>
          <span aria-hidden className="mt-4 block h-1 w-12 rounded-full" style={{ background: "linear-gradient(90deg, var(--glow), var(--accent-2))" }} />
        </div>
      </header>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

function SoonChip() {
  return (
    <span className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-line px-1.5 align-middle text-[10px] font-semibold text-fg-muted">
      <Clock className="size-2.5" aria-hidden />
      به‌زودی
    </span>
  );
}

/** Visible locked state for a section whose data has not been supplied yet. */
function LockedPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-disabled="true"
      title="به‌زودی"
      className="grain relative flex min-h-36 flex-col items-start justify-center gap-3 overflow-hidden rounded-tile border border-dashed border-line bg-surface/60 p-6 opacity-70 saturate-50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-line bg-bg/40">
          <Lock className="size-5 text-fg-muted" aria-hidden />
        </span>
        <p className="font-bold text-fg-muted">{label}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted">
        <Lock className="size-3" aria-hidden />
        به‌زودی
      </span>
    </div>
  );
}

function Closing({ product }: { product: ResolvedProduct }) {
  return (
    <div className="grid gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-3">
        {product.version && (
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-sm text-fg-muted">
            نسخه فعلی
            <span className="ltr-nums font-bold text-fg">{toPersianDigits(product.version)}</span>
          </p>
        )}
      </div>
      {product.motto && <p className="display text-balance text-2xl leading-[1.5] sm:text-4xl lg:col-span-9">{product.motto}</p>}
    </div>
  );
}

function ConsultCta({ product }: { product: ResolvedProduct }) {
  return (
    <aside className="grain relative overflow-hidden rounded-tile border border-[color-mix(in_oklab,var(--glow)_40%,transparent)] bg-surface p-6 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 90% at 100% 0%, color-mix(in oklab, var(--glow) 38%, transparent), transparent 70%)," +
            "radial-gradient(50% 80% at 0% 100%, color-mix(in oklab, var(--accent-2) 26%, transparent), transparent 70%)",
        }}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="display text-balance text-2xl sm:text-3xl">کدام سطح برای کسب‌وکار شما مناسب است؟</h2>
          <p className="mt-3 text-fg-muted">برای انتخاب {product.nameFa} متناسب با کسب‌وکارتان، کارشناسان ما با شما تماس می‌گیرند.</p>
        </div>
        <Link
          href={`/consult?product=${product.slug}`}
          className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full py-2 pe-5 ps-2 text-sm font-bold text-white shadow-[0_14px_40px_-12px_var(--glow)] transition hover:brightness-110 active:scale-[0.98] lg:self-auto"
          style={{ background: "linear-gradient(135deg, var(--glow), color-mix(in oklab, var(--glow) 60%, black))" }}
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/20">
            <MessageSquareText className="size-4" aria-hidden />
          </span>
          درخواست مشاوره
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
