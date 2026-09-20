import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink, Lock } from "lucide-react";
import { ActionCard } from "@/components/product/ActionCard";
import { getProduct, products, type ActionKey } from "@/content/products";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

type Params = Promise<{ product: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = getProduct((await params).product);
  if (!product) return {};
  return { title: product.nameFa, description: product.tagline };
}

/** Asymmetric placement of the five action cards on desktop. */
const ACTION_LAYOUT: Record<ActionKey, string> = {
  panel: "lg:col-span-4",
  support: "lg:col-span-4",
  pricing: "lg:col-span-4",
  details: "lg:col-span-8",
  ai: "lg:col-span-4",
};

export default async function ProductHubPage({ params }: { params: Params }) {
  const product = getProduct((await params).product);
  if (!product) notFound();

  const locked = product.status === "coming_soon";

  return (
    <div
      className="relative"
      style={{ "--accent": product.accent.primary, "--accent-2": product.accent.secondary } as React.CSSProperties}
    >
      {/* ---------- Brand header ---------- */}
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)," +
              "radial-gradient(50% 45% at 0% 100%, color-mix(in oklab, var(--accent-2) 35%, transparent), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg">
            <ArrowRight className="size-4" aria-hidden />
            همه‌ی محصولات
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {locked && (
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-fg-muted">
                  <Lock className="size-3" aria-hidden />
                  به‌زودی
                </span>
              )}
              <h1 className="display text-balance text-4xl sm:text-5xl lg:text-6xl">{product.nameFa}</h1>
              <p className="mt-4 text-xl text-fg-muted">{product.tagline}</p>

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
                {product.website && (
                  <div>
                    <dt className="text-fg-faint">وب‌سایت</dt>
                    <dd>
                      <a
                        href={product.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ltr-nums inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
                      >
                        {product.website.replace("https://", "")}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </dd>
                  </div>
                )}
                {product.version && (
                  <div>
                    <dt className="text-fg-faint">نسخه فعلی</dt>
                    <dd className="font-semibold">{toPersianDigits(product.version)}</dd>
                  </div>
                )}
                {product.phone && (
                  <div>
                    <dt className="text-fg-faint">تلفن اختصاصی</dt>
                    <dd>
                      <a href={`tel:${product.phone}`} className="ltr-nums font-semibold">
                        {toPersianDigits(product.phone)}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="grain flex aspect-[4/3] items-center justify-center rounded-tile border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-surface p-10">
                <Image
                  src={product.logo.landing}
                  alt={`لوگوی ${product.nameFa}`}
                  width={1080}
                  height={720}
                  priority
                  className={cn(
                    "h-auto max-h-56 w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
                    product.logo.landingLight && "light:hidden",
                  )}
                />
                {product.logo.landingLight && (
                  <Image
                    src={product.logo.landingLight}
                    alt=""
                    aria-hidden
                    width={1080}
                    height={720}
                    className="hidden h-auto max-h-56 w-auto object-contain light:block"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Actions ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="display text-2xl sm:text-3xl">دسترسی‌ها</h2>
          {locked && <p className="text-sm text-fg-muted">این محصول هنوز عمومی نشده است.</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {product.actions.map((action, i) => (
            <ActionCard key={action.key} action={action} index={i} className={ACTION_LAYOUT[action.key]}>
              {action.enabled && action.key === "details" && (
                <div className="mt-4 space-y-4">
                  {product.description && (
                    <p className="max-w-2xl text-base leading-8 text-fg-muted">{product.description}</p>
                  )}
                  {action.content && (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {action.content.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <Check className="size-4 shrink-0 text-[var(--accent-2)] light:text-[var(--accent)]" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!action.content && (
                    <p className="inline-flex items-center gap-1.5 text-xs text-fg-faint">
                      <Lock className="size-3" aria-hidden />
                      ویژگی‌های کلیدی به‌زودی
                    </p>
                  )}
                </div>
              )}
              {action.enabled && action.key === "pricing" && action.content && (
                <div className="mt-4">
                  <ul className="flex flex-wrap gap-2">
                    {action.content.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  {action.note && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-faint">
                      <Lock className="size-3" aria-hidden />
                      {action.note}
                    </p>
                  )}
                </div>
              )}
            </ActionCard>
          ))}
        </div>
      </section>
    </div>
  );
}
