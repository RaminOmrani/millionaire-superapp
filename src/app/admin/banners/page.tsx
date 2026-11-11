import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { toggleBanner } from "@/app/admin/banner-actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { BannerCarousel } from "@/components/brand/BannerCarousel";
import { toBannerView } from "@/content/banners";
import { getDb, schema } from "@/db/client";
import { formatDateFa } from "@/lib/format";
import { toPersianDigits } from "@/lib/persian-digits";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PLACEMENT = { top: "بالای صفحه", middle: "میانه‌ی صفحه" } as const;
const AUDIENCE = { both: "سایت و اپ", web: "فقط سایت", app: "فقط اپ" } as const;

function loadBanners() {
  const now = Date.now();
  const rows = getDb().select().from(schema.banners).orderBy(asc(schema.banners.placement), asc(schema.banners.sort), desc(schema.banners.id)).all();
  return rows.map((b) => ({
    b,
    live: b.active && (!b.startsAt || b.startsAt.getTime() <= now) && (!b.endsAt || b.endsAt.getTime() >= now),
  }));
}

export default async function BannersPage() {
  await requireAdmin();
  const rows = loadBanners();

  return (
    <AdminShell
      title="بنرها"
      current="/admin/banners"
      actions={
        <Link href="/admin/banners/new" className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-bold text-bg hover:opacity-90">
          <Plus className="size-4" aria-hidden />
          بنر جدید
        </Link>
      }
    >
      <div className="mb-6 grid gap-3 text-sm leading-7 sm:grid-cols-2">
        <div className="rounded-tile border border-line bg-bg-elevated p-4">
          <p className="font-bold">بالای صفحه: یک بنر ثابت</p>
          <p className="mt-1 text-fg-muted">
            همیشه فقط <strong className="text-fg">یک</strong> بنر نشان داده می‌شود، بدون چرخش: اولین بنر فعالِ داخل بازه‌ی زمانی، به ترتیب
            «عدد ترتیب» (کمتر = اول) و در ترتیب برابر، جدیدترین. بقیه‌ی بنرهای این جایگاه تا نوبتشان برسد دیده نمی‌شوند. اگر بنری
            نباشد، بنر پیش‌فرض «درخواست مشاوره» نمایش داده می‌شود.
          </p>
        </div>
        <div className="rounded-tile border border-line bg-bg-elevated p-4">
          <p className="font-bold">میانه‌ی صفحه: اسلایدر</p>
          <p className="mt-1 text-fg-muted">
            <strong className="text-fg">همه‌ی</strong> بنرهای فعالِ این جایگاه به‌ترتیب و خودکار می‌چرخند (با نقطه‌های راهنما و کشیدن با
            انگشت). اگر بنری نباشد، دو اسلاید پیش‌فرض نمایش داده می‌شود: همراه +۵۰۰۰ کسب‌وکار و معرفی گارسون‌یار.
          </p>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-tile border border-dashed border-line bg-bg-elevated p-10 text-center text-sm text-fg-muted">
          هنوز بنری ساخته نشده. با ساختن اولین بنر هر جایگاه، بنر(های) پیش‌فرض همان جایگاه کنار می‌رود.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rows.map(({ b, live }) => {
            const toggle = toggleBanner.bind(null, b.id);
            return (
              <li key={b.id} className="rounded-tile border border-line bg-bg-elevated p-4">
                <div data-theme="dark" className="rounded-2xl bg-bg p-2">
                  <BannerCarousel banners={[{ ...toBannerView(b), audience: "both" }]} size={b.placement} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className={cn("rounded-full border px-2.5 py-0.5 font-semibold", live ? "border-[#0048a8]/30 bg-[#0048a8]/10 text-[#0048a8]" : "border-line text-fg-muted")}>
                    {live ? "در حال نمایش" : b.active ? "خارج از بازه‌ی زمانی" : "غیرفعال"}
                  </span>
                  <span className="rounded-full border border-line px-2.5 py-0.5">{PLACEMENT[b.placement]}</span>
                  <span className="rounded-full border border-line px-2.5 py-0.5">{AUDIENCE[b.audience]}</span>
                  <span className="rounded-full border border-line px-2.5 py-0.5">ترتیب {toPersianDigits(b.sort)}</span>
                  {(b.startsAt || b.endsAt) && (
                    <span className="text-fg-muted">
                      {b.startsAt ? formatDateFa(b.startsAt) : "…"} تا {b.endsAt ? formatDateFa(b.endsAt) : "…"}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/admin/banners/${b.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-xs font-bold text-bg">
                    <Pencil className="size-3.5" aria-hidden />
                    ویرایش
                  </Link>
                  <form action={toggle}>
                    <button type="submit" className="rounded-full border border-line px-4 py-2 text-xs font-medium hover:bg-bg">
                      {b.active ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
