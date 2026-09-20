import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { toggleProductStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { getResolvedProducts } from "@/content/resolve";
import { formatDateTimeFa } from "@/lib/format";
import { getDb, schema } from "@/db/client";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = getResolvedProducts();
  const rows = new Map(getDb().select().from(schema.productContent).all().map((r) => [r.slug, r]));

  return (
    <AdminShell title="محصولات" current="/admin/products">
      <p className="mb-5 text-sm text-fg-muted">
        محتوای هر محصول روی مقادیر data.md سوار می‌شود. تغییرات بلافاصله روی سایت اعمال می‌شود.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => {
          const row = rows.get(p.slug);
          const enabledCount = p.actions.filter((a) => a.enabled).length;
          const setStatus = toggleProductStatus.bind(null, p.slug);
          return (
            <div
              key={p.slug}
              className="flex gap-5 rounded-tile border border-line bg-bg-elevated p-5"
              style={{ "--accent": p.accent.primary } as React.CSSProperties}
            >
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-line bg-bg p-3">
                <Image
                  src={p.logo.landingLight ?? p.logo.landing}
                  alt=""
                  width={200}
                  height={140}
                  className="h-auto max-h-16 w-auto object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{p.nameFa}</h2>
                    <p className="text-xs text-fg-muted">{p.tagline}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      p.status === "active" ? "border-[#0048a8]/30 bg-[#0048a8]/10 text-[#0048a8]" : "border-line text-fg-muted",
                    )}
                  >
                    {p.status === "active" ? "فعال" : "به‌زودی"}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-fg-muted">
                  <dt>دسترسی‌های فعال</dt>
                  <dd className="font-semibold text-fg">{enabledCount} از ۵</dd>
                  <dt>پلن قیمت</dt>
                  <dd className="font-semibold text-fg">{row?.plans?.length ?? 0}</dd>
                  <dt>آخرین ویرایش</dt>
                  <dd className="font-semibold text-fg">{row ? formatDateTimeFa(row.updatedAt) : "—"}</dd>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-xs font-bold text-bg hover:opacity-90"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    ویرایش محتوا
                  </Link>
                  <form action={setStatus}>
                    <input type="hidden" name="status" value={p.status === "active" ? "coming_soon" : "active"} />
                    <button type="submit" className="rounded-full border border-line px-4 py-2 text-xs font-medium hover:bg-bg">
                      {p.status === "active" ? "تبدیل به «به‌زودی»" : "فعال کردن"}
                    </button>
                  </form>
                  <Link href={`/${p.slug}`} target="_blank" className="text-xs text-fg-muted underline-offset-4 hover:underline">
                    مشاهده در سایت
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
