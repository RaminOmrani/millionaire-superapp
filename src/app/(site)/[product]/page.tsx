import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, LifeBuoy, MessageSquareText, Phone } from "lucide-react";
import { ActionCard } from "@/components/product/ActionCard";
import { RecordVisit } from "@/components/product/RecordVisit";
import { holding } from "@/content/holding";
import { getProduct, type ActionKey } from "@/content/products";
import { getResolvedProduct, type ResolvedAction } from "@/content/resolve";
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
    title: product.nameFa,
    description: product.tagline,
    openGraph: { images: [`/og/${slug}.png`] },
  };
}

export default async function ProductHubPage({ params }: { params: Params }) {
  const slug = (await params).product;
  const product = getResolvedProduct(slug);
  if (!product) notFound();

  const locked = product.status === "coming_soon";
  const phone = product.phone ?? holding.phone;
  // Short links first; «امکانات و سطح‌بندی» closes the grid.
  const ORDER: ActionKey[] = ["panel", "support", "videos", "pricing", "ai", "details"];
  const ordered = [...product.actions].sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));
  const featuresLink = `/${product.slug}/features`;

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
      <RecordVisit slug={product.slug} />
      {/* ---------- Brand header: back link → logo → name/tagline → shared meta → consult CTA ---------- */}
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, var(--glow) 45%, transparent), transparent 70%)," +
              "radial-gradient(50% 45% at 0% 100%, color-mix(in oklab, var(--accent-2) 35%, transparent), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition hover:text-fg">
            <ArrowRight className="size-4" aria-hidden />
            همه‌ی محصولات
          </Link>

          <div className="mt-6 grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
            {/* logo first (top on phones, right column on desktop) */}
            <div className="lg:col-span-4">
              <div className="grain mx-auto flex aspect-[4/3] max-w-[280px] items-center justify-center sm:max-w-sm rounded-tile border border-[color-mix(in_oklab,var(--glow)_35%,transparent)] bg-surface p-8">
                <Image
                  src={product.logo.landing}
                  alt={`لوگوی ${product.nameFa}`}
                  width={1080}
                  height={720}
                  priority
                  className={cn(
                    "h-full max-h-40 w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
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
                    className="hidden h-full max-h-40 w-auto object-contain light:block"
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-8">
              {locked && (
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-fg-muted">
                  <Clock className="size-3" aria-hidden />
                  به‌زودی
                </span>
              )}
              <h1 className="display text-balance text-3xl sm:text-4xl lg:text-5xl">{product.nameFa}</h1>
              <p className="mt-3 text-lg text-fg-muted">{product.tagline}</p>

              {/* same three facts on every product page */}
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <Meta icon={ExternalLink} label="وب‌سایت">
                  {product.website ? (
                    <a href={product.website} target="_blank" rel="noopener noreferrer" className="ltr-nums font-semibold underline-offset-4 hover:underline">
                      {product.website.replace("https://", "")}
                    </a>
                  ) : (
                    <span className="text-fg-faint">به‌زودی</span>
                  )}
                </Meta>
                <Meta icon={Phone} label="تلفن">
                  <a href={`tel:${phone.replace(/-/g, "")}`} className="ltr-nums font-semibold">
                    {toPersianDigits(phone)}
                  </a>
                </Meta>
                <Meta icon={LifeBuoy} label="پشتیبانی">
                  <a href={holding.supportCenter} target="_blank" rel="noopener noreferrer" className="ltr-nums font-semibold underline-offset-4 hover:underline">
                    support.softmiliac.com
                  </a>
                </Meta>
              </dl>

              <Link
                href={`/consult?product=${product.slug}`}
                className="group mt-6 inline-flex items-center gap-3 rounded-full py-2 pe-5 ps-2 text-sm font-bold text-white shadow-[0_14px_40px_-12px_var(--glow)] transition hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, var(--glow), color-mix(in oklab, var(--glow) 60%, black))" }}
              >
                <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-white/20">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/25 [animation-duration:2.4s] motion-reduce:hidden" aria-hidden />
                  <MessageSquareText className="relative size-4" aria-hidden />
                </span>
                درخواست مشاوره برای {product.nameFa}
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Short intro → actions ---------- */}
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-8 sm:mt-10 sm:px-6 lg:px-8">
        {product.description && (
          <div className="mb-10 max-w-3xl border-s-2 border-[color-mix(in_oklab,var(--glow)_70%,transparent)] ps-4 sm:ps-5">
            <p className="line-clamp-3 text-base leading-8 text-fg-muted">{product.description}</p>
            <Link
              href={featuresLink}
              className="group mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-fg underline decoration-[color-mix(in_oklab,var(--glow)_70%,transparent)] decoration-2 underline-offset-[6px] transition hover:decoration-fg"
            >
              امکانات و سطح‌بندی
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </Link>
          </div>
        )}

        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="display text-xl sm:text-2xl">دسترسی‌ها</h2>
          {locked && <p className="text-sm text-fg-muted">این محصول به‌زودی عرضه می‌شود؛ تا آن زمان معرفی و امکاناتش را ببینید.</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {ordered.map((action, i) => (
            <ActionCard
              key={action.key}
              action={action}
              index={i}
              className={cellClass(i, ordered.length)}
              caption={captionFor(action)}
            >
              {action.enabled && action.key === "pricing" && !action.plans?.length && action.content && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {action.content.map((item) => (
                    <li key={item} className="rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {action.enabled && action.key !== "details" && action.key !== "pricing" && action.content && (
                <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
                  {action.content.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </ActionCard>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Six-column grid on desktop: rows of three cards; a short last row stretches
 * (two cards → half each, one card → full width). On two-column tablets an odd last card spans both.
 */
function cellClass(i: number, n: number): string {
  const rest = n % 3;
  const inLastRow = i >= n - rest;
  const lg = rest === 0 || !inLastRow ? "lg:col-span-2" : rest === 2 ? "lg:col-span-3" : "lg:col-span-6";
  const sm = n % 2 === 1 && i === n - 1 ? "sm:col-span-2" : "";
  return cn(sm, lg);
}

function captionFor(action: ResolvedAction): string | undefined {
  if (!action.enabled) return undefined;
  if (action.key === "details") return "معرفی کامل، امکانات و پکیج‌ها";
  if (action.key === "pricing" && action.plans?.length) return `${toPersianDigits(action.plans.length)} پکیج — مشاهده‌ی جزئیات`;
  return undefined;
}

function Meta({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/60 px-4 py-3">
      <Icon className="size-4 shrink-0 text-fg-faint" aria-hidden />
      <div className="min-w-0">
        <dt className="text-xs text-fg-faint">{label}</dt>
        <dd className="truncate">{children}</dd>
      </div>
    </div>
  );
}
