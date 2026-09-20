import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import type { ActionOverride, PricingPlan, ProductContentRow } from "@/db/schema";
import { ACTION_LABELS, products, type ActionKey, type Product, type ProductAction, type ProductSlug } from "./products";

/** A product after DB overrides are layered over products.ts. Plain data — safe to pass to client components. */
export interface ResolvedAction {
  key: ActionKey;
  label: string;
  enabled: boolean;
  href?: string;
  note?: string;
  content?: string[];
  /** Pricing plans (pricing action only) */
  plans?: PricingPlan[];
  /** True when the value comes from the admin panel rather than data.md */
  overridden: boolean;
}

export interface ResolvedProduct extends Omit<Product, "actions" | "description" | "website" | "version"> {
  description?: string;
  website?: string;
  version?: string;
  features: string[];
  actions: ResolvedAction[];
  overridden: boolean;
}

function baseAction(a: ProductAction): Omit<ResolvedAction, "overridden"> {
  if (a.enabled) {
    return {
      key: a.key,
      label: a.label,
      enabled: true,
      href: a.href,
      note: a.note,
      content: a.content ? [...a.content] : undefined,
    };
  }
  return { key: a.key, label: a.label, enabled: false };
}

function mergeAction(base: ProductAction, ov: ActionOverride | undefined, plans: PricingPlan[] | undefined): ResolvedAction {
  const b = baseAction(base);
  const label = ACTION_LABELS[base.key];
  const hasPlans = base.key === "pricing" && !!plans && plans.length > 0;

  if (!ov && !hasPlans) return { ...b, label, overridden: false };

  const enabled = ov?.enabled ?? (hasPlans ? true : b.enabled);
  return {
    key: base.key,
    label,
    enabled,
    href: ov?.href === null ? undefined : (ov?.href ?? b.href),
    // A data.md note like «قیمت به‌زودی» must not survive next to real plans.
    note: ov?.note === null ? undefined : (ov?.note ?? (hasPlans ? undefined : b.note)),
    content: ov?.content && ov.content.length > 0 ? ov.content : b.content,
    plans: hasPlans ? plans : undefined,
    overridden: true,
  };
}

export function resolveProduct(base: Product, row: ProductContentRow | undefined): ResolvedProduct {
  const detailsBase = base.actions.find((a) => a.key === "details");
  const baseFeatures = detailsBase && detailsBase.enabled && detailsBase.content ? [...detailsBase.content] : [];
  const features = row?.features && row.features.length > 0 ? row.features : baseFeatures;

  const actions = base.actions.map((a) => {
    const merged = mergeAction(a, row?.actions?.[a.key], row?.plans ?? undefined);
    if (a.key === "details" && features.length > 0) merged.content = features;
    return merged;
  });

  return {
    ...base,
    status: row?.status ?? base.status,
    description: row?.description ?? base.description,
    website: row?.website ?? base.website,
    version: row?.version ?? base.version,
    features,
    actions,
    overridden: !!row,
  };
}

function loadRows(): Map<string, ProductContentRow> {
  const rows = getDb().select().from(schema.productContent).all();
  return new Map(rows.map((r) => [r.slug, r]));
}

/** All products with admin overrides applied (reads SQLite; call from server code only). */
export function getResolvedProducts(): ResolvedProduct[] {
  const rows = loadRows();
  return products.map((p) => resolveProduct(p, rows.get(p.slug)));
}

export function getResolvedProduct(slug: string): ResolvedProduct | undefined {
  const base = products.find((p) => p.slug === slug);
  if (!base) return undefined;
  const row = getDb().select().from(schema.productContent).where(eqSlug(slug)).get();
  return resolveProduct(base, row);
}

export function getProductContentRow(slug: ProductSlug): ProductContentRow | undefined {
  return getDb().select().from(schema.productContent).where(eqSlug(slug)).get();
}

function eqSlug(slug: string) {
  return eq(schema.productContent.slug, slug);
}
