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
      /** Small caption under the content — e.g. what is still pending */
      note?: string;
    }
  | {
      key: ActionKey;
      label: string;
      enabled: false;
      /** Why it is locked — shown as a tooltip; user-facing text is always «به‌زودی» */
      reason: "missing_data" | "future";
      /** One-line teaser shown on the locked card (only text Ramin supplied) */
      teaser?: string;
    };

export interface FeatureGroup {
  title: string;
  items: readonly { text: string; soon?: boolean }[];
}

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
  /** Grouped feature list for the details card (richer than the flat `content`) */
  featureGroups?: readonly FeatureGroup[];
  /** Short «why this product» points */
  highlights?: readonly string[];
  /** Closing brand line on the hub */
  motto?: string;
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
    /** Compact mark / app icon for dark surfaces */
    mark: string;
    /** Mark variant for light surfaces when `mark` has white parts that vanish */
    markLight?: string;
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

// Ramin: the AI layer differs per product — from analysis and reports to forecasting.
const AI_TEASER = "از تحلیل و گزارش تا پیش‌بینی؛ متناسب با هر محصول";

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
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future", teaser: AI_TEASER },
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
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future", teaser: AI_TEASER },
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
      {
        key: "pricing",
        label: ACTION_LABELS.pricing,
        enabled: true,
        href: "https://shopmojahaz.ir",
        // Four suggested packages (data.md §3.3); price and contents are still ❓.
        content: ["پکیج اقتصادی", "پکیج نقره‌ای", "پکیج ویژه", "پکیج طلایی"],
        note: "قیمت و محتوای هر پکیج به‌زودی",
      },
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
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future", teaser: AI_TEASER },
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
      // Persian lockups (tagline outlined to paths from LOGO.ai): white on dark, navy on light.
      landing: "/brand/menuclub/swoosh-2.svg",
      landingLight: "/brand/menuclub/lockup-fa.svg",
      mark: "/brand/menuclub/swoosh-3.svg",
      markLight: "/brand/menuclub/mark.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: true, href: "https://menusclub.ir" },
      { key: "support", label: ACTION_LABELS.support, enabled: true, href: SUPPORT_URL },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "missing_data" },
      { key: "details", label: ACTION_LABELS.details, enabled: true },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future", teaser: AI_TEASER },
    ],
  },
  {
    slug: "garson",
    nameFa: "گارسون‌یار",
    nameEn: "Garson-yar",
    tagline: "سفارش‌گیری هوشمند رستوران",
    description:
      "گارسون‌یار یک نرم‌افزار تحت وب حرفه‌ای و کامل برای مدیریت رستوران، کافه و مجموعه‌های غذایی است که تمام نیازهای روزمره شما را در یک پلتفرم یکپارچه پوشش می‌دهد. این سیستم با طراحی مدرن، رابط کاربری فارسی و کاملاً ساده، به شما کمک می‌کند تا سفارش‌گیری، مدیریت میزها، حسابداری و نظارت بر پرسنل را با بیشترین سرعت و دقت انجام دهید.",
    // website garson.softmiliac.com is not public yet — not linked
    status: "coming_soon",
    motto: "گارسون‌یار؛ دستیار هوشمند شما در مدیریت رستوران.",
    highlights: [
      "کامل و یکپارچه — تمام نیازهای مدیریت رستوران در یک نرم‌افزار",
      "سریع و آسان — سفارش‌گیری در چند ثانیه",
      "هوشمند — همگام‌سازی خودکار با نرم‌افزارهای موجود",
      "مدرن — طراحی زیبا و رابط کاربری ساده",
      "قابل اعتماد — امنیت بالا و مدیریت دقیق دسترسی‌ها",
      "همه‌جا در دسترس — روی موبایل، تبلت و کامپیوتر",
    ],
    featureGroups: [
      {
        title: "داشبورد مدیریتی هوشمند",
        items: [
          { text: "مشاهده لحظه‌ای آمار فروش، تعداد سفارشات و وضعیت مجموعه در یک نگاه" },
          { text: "نمودار روند فروش ساعتی امروز در مقایسه با دیروز" },
          { text: "مشاهده سریع آخرین سفارشات و وضعیت میزها" },
          { text: "لیست محبوب‌ترین و پرفروش‌ترین محصولات" },
          { text: "هشدار خودکار برای محصولات ناموجود" },
        ],
      },
      {
        title: "مدیریت کامل منو",
        items: [
          { text: "دسته‌بندی محصولات با تصاویر اختصاصی برای هر دسته" },
          { text: "جستجوی سریع در بین محصولات" },
          { text: "فیلترهای هوشمند برای محصولات" },
          { text: "نمایش موجودی هر محصول به صورت لحظه‌ای" },
          { text: "بارگذاری سریع منو و بهینه شده برای تعداد بالای محصولات" },
          { text: "قابلیت مشاهده محصولات ناموجود در یک صفحه‌ی مجزا" },
        ],
      },
      {
        title: "سفارش‌گیری سریع و آسان",
        items: [
          { text: "سبد خرید هوشمند با نمایش لحظه‌ای تعداد و مبلغ" },
          { text: "افزودن محصول با تعیین تعداد و یادداشت دلخواه" },
          { text: "دکمه‌های میانبر برای انتخاب سریع تعداد" },
          { text: "کنترل خودکار موجودی هنگام ثبت سفارش" },
          { text: "امکان پرداخت در لحظه یا ثبت سفارش در انتظار پرداخت" },
          { text: "لینک با دستگاه‌های کارتخوان مجموعه", soon: true },
        ],
      },
      {
        title: "مدیریت میزها",
        items: [
          { text: "تعریف میز با نام، ظرفیت، موقعیت و وضعیت" },
          { text: "تغییر سریع وضعیت میز (آزاد/مشغول/رزرو) از داشبورد" },
          { text: "امکان اتصال به میزهای منوی دیجیتال (وردپرس)", soon: true },
          { text: "مدیریت موقعیت‌ها" },
          { text: "نمایش گرافیکی وضعیت همه میزها در لحظه" },
        ],
      },
      {
        title: "مدیریت و پیگیری سفارشات",
        items: [
          { text: "مشاهده همه سفارشات با جزئیات کامل" },
          { text: "فیلتر بر اساس وضعیت، تاریخ، گارسون و میز" },
          { text: "پرداخت مستقیم سفارشات در انتظار" },
          { text: "ویرایش و لغو سفارش با بازگشت خودکار موجودی", soon: true },
        ],
      },
      {
        title: "حسابداری و گزارشات حرفه‌ای",
        items: [
          { text: "آمار فروش امروز، ماه و بازه‌های دلخواه" },
          { text: "نمودار فروش ۷ روز اخیر" },
          { text: "نمودار فروش بر اساس دسته‌بندی" },
          { text: "لیست کامل تراکنش‌ها با جمع کل" },
          { text: "خروجی اکسل از گزارشات" },
          { text: "آمار تفکیکی عملکرد دقیق هر گارسون (تعداد سفارش، فروش کل، میانگین)" },
        ],
      },
      {
        title: "مدیریت پرسنل",
        items: [
          { text: "افزودن، ویرایش و حذف گارسون‌ها" },
          { text: "ثبت اطلاعات کامل هر گارسون (موبایل، ایمیل، شیفت، بخش و ...)" },
          { text: "آپلود تصویر پروفایل برای هر گارسون" },
          { text: "جستجو و فیلتر سریع در بین پرسنل" },
          { text: "مشاهده آمار عملکرد هر گارسون" },
        ],
      },
      {
        title: "مدیریت تصاویر",
        items: [
          { text: "آپلود تصویر برای هر محصول" },
          { text: "آپلود تصویر برای هر دسته‌بندی" },
          { text: "جستجوی سریع برای ویرایش تصاویر" },
          { text: "بارگذاری بهینه تصاویر" },
        ],
      },
      {
        title: "همگام‌سازی هوشمند",
        items: [
          { text: "همگام‌سازی خودکار محصولات با نرم‌افزار حسابداری" },
          { text: "ارسال خودکار سفارشات به نرم‌افزار حسابداری" },
          { text: "به‌روزرسانی لحظه‌ای موجودی انبار در نرم‌افزار حسابداری" },
        ],
      },
      {
        title: "تنظیمات اختصاصی",
        items: [
          { text: "آپلود لوگوی مجموعه" },
          { text: "انتخاب منبع میزها جهت نمایش و ثبت سفارش" },
          { text: "دریافت کامل محصولات از نرم‌افزار حسابداری با نمایش پیشرفت لحظه‌ای" },
          { text: "ویرایش پروفایل کاربری" },
        ],
      },
      {
        title: "تجربه کاربری حرفه‌ای",
        items: [
          { text: "قابل نصب روی موبایل" },
          { text: "طراحی کاملاً واکنش‌گرا برای موبایل، تبلت و کامپیوتر" },
          { text: "حالت شب (Dark Mode) برای استفاده در محیط‌های کم‌نور" },
          { text: "طراحی مدرن، ساده و کاربرپسند" },
          { text: "هشدارها و پیام‌های راهنما در تمام مراحل" },
          { text: "سطوح دسترسی متفاوت برای مدیر و گارسون" },
        ],
      },
    ],
    accent: { primary: "#c80840", secondary: "#101840" },
    logo: {
      // logo-full.svg is crimson + navy (vanishes on dark); white/crimson mark for dark.
      landing: "/brand/garson/mark.svg",
      landingLight: "/brand/garson/logo-full.svg",
      mark: "/brand/garson/mark-round.svg",
      markLight: "/brand/garson/logo-full.svg",
    },
    actions: [
      { key: "panel", label: ACTION_LABELS.panel, enabled: false, reason: "future" },
      { key: "support", label: ACTION_LABELS.support, enabled: false, reason: "future" },
      { key: "pricing", label: ACTION_LABELS.pricing, enabled: false, reason: "future" },
      { key: "details", label: ACTION_LABELS.details, enabled: true },
      { key: "ai", label: ACTION_LABELS.ai, enabled: false, reason: "future", teaser: AI_TEASER },
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
