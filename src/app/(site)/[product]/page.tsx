import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink, Lock, MessageSquareText, Star } from "lucide-react";
import { ActionCard } from "@/components/product/ActionCard";
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

/** Asymmetric placement of the five action cards on desktop. */
const ACTION_LAYOUT: Record<ActionKey, string> = {
  panel: "lg:col-span-4",
  support: "lg:col-span-4",
  pricing: "lg:col-span-4",
  details: "lg:col-span-8",
  ai: "lg:col-span-4",
};

export default async function ProductHubPage({ params }: { params: Params }) {
  const slug = (await params).product;
  const product = getResolvedProduct(slug);
  if (!product) notFound();

  const locked = product.status === "coming_soon";
  const pricing = product.actions.find((a) => a.key === "pricing");
  const hasPlans = !!pricing?.enabled && !!pricing.plans?.length;
  // With real plans the pricing card becomes a full-width row at the end; details widens to match.
  const ordered = hasPlans
    ? [...product.actions.filter((a) => a.key !== "pricing"), ...product.actions.filter((a) => a.key === "pricing")]
    : product.actions;
  const layoutFor = (key: ActionKey) => {
    if (!hasPlans) return ACTION_LAYOUT[key];
    if (key === "pricing" || key === "details") return "sm:col-span-2 lg:col-span-12";
    return "lg:col-span-4";
  };

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

              <div className="mt-8">
                <Link
                  href={`/consult?product=${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.98]"
                >
                  <MessageSquareText className="size-4" aria-hidden />
                  مشاوره درباره‌ی {product.nameFa}
                </Link>
              </div>
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
          {ordered.map((action, i) => (
            <ActionCard key={action.key} action={action} index={i} className={layoutFor(action.key)}>
              {action.enabled && action.key === "details" && <DetailsBody description={product.description} action={action} />}
              {action.enabled && action.key === "pricing" && <PricingBody action={action} />}
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

function DetailsBody({ description, action }: { description?: string; action: ResolvedAction }) {
  return (
    <div className="mt-4 space-y-4">
      {description && <p className="max-w-2xl text-base leading-8 text-fg-muted">{description}</p>}
      {action.content && action.content.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {action.content.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <Check className="size-4 shrink-0 text-[var(--accent-2)] light:text-[var(--accent)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="inline-flex items-center gap-1.5 text-xs text-fg-faint">
          <Lock className="size-3" aria-hidden />
          ویژگی‌های کلیدی به‌زودی
        </p>
      )}
    </div>
  );
}

function PricingBody({ action }: { action: ResolvedAction }) {
  if (action.plans && action.plans.length > 0) {
    const n = action.plans.length;
    const cols =
      n === 1 ? "sm:max-w-sm" : n === 2 ? "sm:grid-cols-2 lg:max-w-3xl" : n === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
    return (
      <div className={cn("mt-6 grid gap-4", cols)}>
        {action.plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-5",
              plan.highlight
                ? "border-[color-mix(in_oklab,var(--accent)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
                : "border-line bg-bg/40",
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-fg px-2.5 py-0.5 text-[11px] font-bold text-bg">
                <Star className="size-3" aria-hidden />
                پیشنهاد ما
              </span>
            )}
            <h4 className="font-bold">{plan.name}</h4>
            <p className="mt-2">
              <span className="display text-2xl">{toPersianDigits(plan.price)}</span>
              {plan.period && <span className="mr-1 text-xs text-fg-faint">/ {plan.period}</span>}
            </p>
            {plan.features.length > 0 && (
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-fg-muted">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {plan.href && (
              <a
                href={plan.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold transition hover:bg-fg hover:text-bg"
              >
                خرید
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        ))}
        {action.note && <p className="text-xs text-fg-faint sm:col-span-full">{action.note}</p>}
      </div>
    );
  }
  if (!action.content) return null;
  return (
    <div className="mt-4">
      <ul className="flex flex-wrap gap-2">
        {action.content.map((item) => (
          <li key={item} className="rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted">
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
  );
}
