import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, ExternalLink, LifeBuoy, Lock, MessageSquareText, Phone, Sparkles, Star } from "lucide-react";
import { ActionCard } from "@/components/product/ActionCard";
import { Expandable } from "@/components/product/Expandable";
import { holding } from "@/content/holding";
import { getProduct, type ActionKey } from "@/content/products";
import { getResolvedProduct, type ResolvedAction, type ResolvedProduct } from "@/content/resolve";
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
  const pricing = product.actions.find((a) => a.key === "pricing");
  const hasPlans = !!pricing?.enabled && !!pricing.plans?.length;
  // With real plans the pricing card becomes a full-width row at the end; details widens to match.
  // Short cards first; «اطلاعات و جزئیات» always last and full width (click to expand).
  const ORDER: ActionKey[] = ["panel", "support", "ai", "pricing", "details"];
  const ordered = [...product.actions].sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));
  const richDetails = !!product.featureGroups?.length && product.features.length === 0;
  const layoutFor = (key: ActionKey) => {
    if (key === "details") return "sm:col-span-2 lg:col-span-12";
    if (key === "pricing" && hasPlans) return "sm:col-span-2 lg:col-span-12";
    return hasPlans ? "lg:col-span-4" : "lg:col-span-3";
  };

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

      {/* ---------- Actions ---------- */}
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-8 sm:mt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="display text-xl sm:text-2xl">دسترسی‌ها</h2>
          {locked && <p className="text-sm text-fg-muted">این محصول به‌زودی عرضه می‌شود؛ تا آن زمان معرفی و امکاناتش را ببینید.</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {ordered.map((action, i) => (
            <ActionCard key={action.key} action={action} index={i} className={layoutFor(action.key)}>
              {action.enabled && action.key === "details" && (
                <Expandable collapsedHeight={richDetails ? 260 : 160}>
                  {richDetails ? <RichDetails product={product} /> : <DetailsBody product={product} action={action} />}
                </Expandable>
              )}
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

/** Grouped features + highlights + motto (products with featureGroups, e.g. Garson-yar). */
function RichDetails({ product }: { product: ResolvedProduct }) {
  return (
    <div className="mt-4 space-y-8">
      {product.description && <p className="max-w-3xl text-base leading-8 text-fg-muted">{product.description}</p>}

      {product.highlights && product.highlights.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold">چرا {product.nameFa}؟</h4>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {product.highlights.map((h) => {
              const [head, ...rest] = h.split(" — ");
              return (
                <li key={h} className="rounded-2xl border border-line bg-bg/40 p-4">
                  <p className="flex items-center gap-2 font-bold">
                    <Sparkles className="size-4 shrink-0 text-[var(--glow)]" aria-hidden />
                    {head}
                  </p>
                  {rest.length > 0 && <p className="mt-1 text-sm text-fg-muted">{rest.join(" — ")}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-sm font-bold">امکانات و قابلیت‌ها</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.featureGroups!.map((g) => (
            <section key={g.title} className="rounded-2xl border border-line bg-bg/40 p-4">
              <h5 className="font-bold">{g.title}</h5>
              <ul className="mt-3 space-y-2 text-sm">
                {g.items.map((it) => (
                  <li key={it.text} className="flex items-start gap-2">
                    <Check className="mt-1 size-3.5 shrink-0 text-[var(--glow)]" aria-hidden />
                    <span className="text-fg-muted">
                      {it.text}
                      {it.soon && (
                        <span className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-line px-1.5 text-[10px] font-semibold text-fg-faint">
                          <Clock className="size-2.5" aria-hidden />
                          به‌زودی
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {product.version && (
        <p className="text-sm text-fg-muted">
          نسخه فعلی: <span className="font-semibold text-fg">{toPersianDigits(product.version)}</span>
        </p>
      )}
      {product.motto && <p className="display text-xl sm:text-2xl">{product.motto}</p>}
    </div>
  );
}

function DetailsBody({ product, action }: { product: ResolvedProduct; action: ResolvedAction }) {
  return (
    <div className="mt-4 space-y-4">
      {product.description && <p className="max-w-3xl text-base leading-8 text-fg-muted">{product.description}</p>}
      {action.content && action.content.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {action.content.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <Check className="size-4 shrink-0 text-[var(--glow)] light:text-[var(--accent)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
      {product.version && (
        <p className="text-sm text-fg-muted">
          نسخه فعلی: <span className="font-semibold text-fg">{toPersianDigits(product.version)}</span>
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
