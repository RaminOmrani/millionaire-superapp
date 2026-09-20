import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Lock } from "lucide-react";
import { getProduct, products } from "@/content/products";
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

/**
 * Product hub — phase 1 renders the brand header only.
 * The five action cards (data.md §3) are wired up in phase 2.
 */
export default async function ProductHubPage({ params }: { params: Params }) {
  const product = getProduct((await params).product);
  if (!product) notFound();

  const locked = product.status === "coming_soon";

  return (
    <section
      className="grain relative overflow-hidden"
      style={{ "--accent": product.accent.primary, "--accent-2": product.accent.secondary } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)," +
            "radial-gradient(50% 45% at 0% 100%, color-mix(in oklab, var(--accent-2) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
        >
          <ArrowRight className="size-4" aria-hidden />
          همه‌ی محصولات
        </Link>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {locked && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-fg-muted">
                <Lock className="size-3" aria-hidden />
                به‌زودی
              </span>
            )}
            <h1 className="display text-balance text-4xl sm:text-5xl lg:text-6xl">{product.nameFa}</h1>
            <p className="mt-4 text-xl text-fg-muted">{product.tagline}</p>
            {product.description && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-fg-muted sm:text-lg">{product.description}</p>
            )}

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
  );
}
