/**
 * Product content — the single source of truth for the UI.
 * Every value here is transcribed from data.md §2–§3. Nothing is invented:
 * a field that is ❓ in data.md is either omitted or represented as a locked action.
 */

export type ProductSlug = "millionaire" | "crm" | "shopmojahaz" | "menuclub" | "garson";

export type ProductStatus = "active" | "coming_soon";

export type ActionKey = "panel" | "support" | "pricing" | "details" | "ai";

export type ProductAction =
  | {
      key: ActionKey;
      label: string;
      enabled: true;
      /** External link (opens in new tab) */
      href?: string;
      /** Inline content rendered on the hub page */
      content?: readonly string[];
    }
  | {
      key: ActionKey;
      label: string;
      enabled: false;
      /** Why it is locked — shown as a tooltip; user-facing text is always «به‌زودی» */
      reason: "missing_data" | "future";
    };

export interface Product {
  slug: ProductSlug;
  nameFa: string;
  nameEn: string;
  tagline: string;
  /** Undefined when data.md marks it ❓ */
  description?: string;
  website?: string;
  /** Persian-digit display handled by the UI */
  version?: string;
  phone?: string;
  status: ProductStatus;
  accent: {
    /** Primary accent (hex) */
    primary: string;
    /** Secondary accent for gradients (hex) */
    secondary: string;
  };
  logo: {
    /** Large logo for the landing tile (dark surfaces) */
    landing: string;
    /** Variant for light surfaces when `landing` has white parts that vanish */
    landingLight?: string;
    /** Compact mark */
    mark: string;
  };
  actions: readonly ProductAction[];
}

export const ACTION_LABELS: Record<ActionKey, string> = {
  panel: "ورود به پنل",
  support: "تیکت و پشتیبانی",
  pricing: "خرید و تعرفه‌ها",
  details: "اطلاعات و جزئیات",
  ai: "هوش مصنوعی",
};

// Plain link — the user picks the company and section on the support site itself.
const SUPPORT_URL = "https://support.softmiliac.com";

export const products: readonly Product[] = [
  {
    slug: "millionaire",
    nameFa: "نرم‌افزار حسابداری میلیونر",
    nameEn: "Millionaire Accounting",
    tagline: "پیشگام در حسابداری هوشمند ایران",
    description:
      "میلیونر فقط یک نرم‌افزار حسابداری نیست، بلکه یک همراه هوشمند برای مدیریت مالی شماست. نرم‌افزار حسابداری و انبارداری آسان.",
    website: "https://softmiliac.com",
    status: "active",
    accent: { primary: "#980000", secondary: "#600000" },
    logo: {
      landing: "/brand/millionaire/logo-horizontal.svg",
      mark: "/brand/millionaire/mark.svg",
    },
    actions: [
      // Accounting web panel is still being built (data.md §3.1) — locked.
      { key: "panel", label: ACTION_LABELS.panel, enabled: false, reason: "missing_data" },
      { key: "support", label: ACTION_LABELS.support, enabled: true, href: SUPPORT_URL },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "missing_data" },
      { key: "details", label: ACTION_LABELS.details, enabled: true },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future" },
    ],
  },
  {
    slug: "crm",
    nameFa: "CRM میلیونر",
    nameEn: "Millionaire CRM",
    tagline: "سامانه فروش و پیگیری",
    description:
      "تفکیک ویزیتورها و رقابت سالم فروش؛ هر ویزیتور دیتای خودش را می‌بیند، عملکردش را با گیج می‌سنجد و جایگاهش را در جدول مقایسه دنبال می‌کند. یکپارچه با نرم‌افزار حسابداری میلیونر.",
    website: "https://crm.softmiliac.com",
    version: "2.0.1",
    status: "active",
    accent: { primary: "#981818", secondary: "#600000" },
    logo: {
      // The deep-red wordmark of the full lockup has no contrast on dark surfaces,
      // so dark tiles show the 3D mark; light surfaces get the full new lockup
      // (exported from LOGO.ai with the tagline outlined to paths).
      landing: "/brand/crm/mark-red.svg",
      landingLight: "/brand/crm/lockup-red.svg",
      mark: "/brand/crm/mark-red.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: true, href: "https://crm.softmiliac.com" },
      { key: "support", label: ACTION_LABELS.support, enabled: true, href: SUPPORT_URL },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "missing_data" },
      { key: "details", label: ACTION_LABELS.details, enabled: true },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future" },
    ],
  },
  {
    slug: "shopmojahaz",
    nameFa: "شاپ مجهز",
    nameEn: "Shop Mojahaz",
    tagline: "واردکننده تجهیزات فروشگاهی",
    description:
      "تجهیزات سخت‌افزاری فروشگاهی: صندوق فروشگاهی، بارکدخوان، فیش‌پرینتر، ترازوی دیجیتال، لیبل‌پرینتر، کشوی پول. با استعلام اصالت کالا.",
    website: "https://shopmojahaz.ir",
    phone: "09159029664",
    status: "active",
    accent: { primary: "#0048a8", secondary: "#0068c0" },
    logo: {
      landing: "/brand/shopmojahaz/logo-full-fa.svg",
      mark: "/brand/shopmojahaz/mark.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: true, href: "https://shopmojahaz.ir" },
      { key: "support", label: ACTION_LABELS.support, enabled: true, href: SUPPORT_URL },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: true, href: "https://shopmojahaz.ir" },
      {
        key: "details",
        label: ACTION_LABELS.details,
        enabled: true,
        content: [
          "صندوق فروشگاهی",
          "بارکدخوان",
          "فیش‌پرینتر",
          "ترازوی دیجیتال",
          "لیبل‌پرینتر",
          "کشوی پول",
        ],
      },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future" },
    ],
  },
  {
    slug: "menuclub",
    nameFa: "منوکلاب",
    nameEn: "Menu Club",
    tagline: "خالق تخصصی منوهای دیجیتال",
    description:
      "برای کسب‌وکارهایی که به جزئیات اهمیت می‌دهند. اعتماد، تجربه، زیبایی. منوی دیجیتال QR برای کافه و رستوران.",
    website: "https://menusclub.ir",
    status: "active",
    accent: { primary: "#101840", secondary: "#f8b878" },
    logo: {
      // lockup-fa.svg is navy on navy with a live <text>; white/peach reads on dark.
      landing: "/brand/menuclub/wordmark-en-peach-lg.svg",
      landingLight: "/brand/menuclub/logo-full-en.svg",
      mark: "/brand/menuclub/mark.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: true, href: "https://menusclub.ir" },
      { key: "support", label: ACTION_LABELS.support, enabled: true, href: SUPPORT_URL },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "missing_data" },
      { key: "details", label: ACTION_LABELS.details, enabled: true },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future" },
    ],
  },
  {
    slug: "garson",
    nameFa: "گارسون‌یار",
    nameEn: "Garson-yar",
    tagline: "سفارش‌گیری هوشمند رستوران",
    // description ❓ — locked
    // website garson.softmiliac.com is not public yet — not linked
    status: "coming_soon",
    accent: { primary: "#c80840", secondary: "#101840" },
    logo: {
      // logo-full.svg is crimson + navy (vanishes on dark); white/crimson mark for dark.
      landing: "/brand/garson/mark.svg",
      landingLight: "/brand/garson/logo-full.svg",
      mark: "/brand/garson/mark-round.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: false, reason: "future" },
      { key: "support", label: ACTION_LABELS.support, enabled: false, reason: "future" },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "future" },
      { key: "details", label: ACTION_LABELS.details, enabled: false, reason: "future" },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future" },
    ],
  },
] as const;

export const productSlugs = products.map((p) => p.slug) as readonly ProductSlug[];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function isProductSlug(value: string): value is ProductSlug {
  return productSlugs.includes(value as ProductSlug);
}
