import Link from "next/link";
import { and, desc, eq, gte, like, lte, or, sql, type SQL } from "drizzle-orm";
import { ChevronRight, ChevronLeft, Download, Search } from "lucide-react";
import { bulkUpdateStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PRODUCT_LABELS, STATUS_LABELS } from "@/content/labels";
import { inputClass } from "@/components/ui/Field";
import { getDb, schema } from "@/db/client";
import { CONSULT_PRODUCTS, CONSULT_STATUSES } from "@/db/schema";
import { formatDateTimeFa, formatMobileFa } from "@/lib/format";
import { toLatinDigits, toPersianDigits } from "@/lib/persian-digits";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type Status = (typeof CONSULT_STATUSES)[number];
type ProductKey = (typeof CONSULT_PRODUCTS)[number];

const isStatus = (v?: string): v is Status => !!v && (CONSULT_STATUSES as readonly string[]).includes(v);
const isProduct = (v?: string): v is ProductKey => !!v && (CONSULT_PRODUCTS as readonly string[]).includes(v);

type Search = { status?: string; product?: string; q?: string; from?: string; to?: string; page?: string };

function buildQuery(sp: Search) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) if (v) qs.set(k, v);
  return qs;
}

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = isStatus(sp.status) ? sp.status : undefined;
  const product = isProduct(sp.product) ? sp.product : undefined;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const t = schema.consultRequests;
  const where: SQL[] = [];
  if (status) where.push(eq(t.status, status));
  if (product) where.push(eq(t.product, product));
  if (q) {
    const term = `%${q}%`;
    const phoneTerm = `%${toLatinDigits(q)}%`;
    where.push(or(like(t.fullName, term), like(t.businessName, term), like(t.phone, phoneTerm))!);
  }
  if (sp.from) {
    const d = new Date(sp.from);
    if (!Number.isNaN(d.getTime())) where.push(gte(t.createdAt, d));
  }
  if (sp.to) {
    const d = new Date(sp.to);
    if (!Number.isNaN(d.getTime())) where.push(lte(t.createdAt, new Date(d.getTime() + 86_400_000)));
  }
  const cond = where.length ? and(...where) : undefined;

  const db = getDb();
  const total = db.select({ n: sql<number>`count(*)` }).from(t).where(cond).get()?.n ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = db
    .select()
    .from(t)
    .where(cond)
    .orderBy(desc(t.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)
    .all();

  const counts = db.select({ status: t.status, n: sql<number>`count(*)` }).from(t).groupBy(t.status).all();
  const countBy = Object.fromEntries(counts.map((c) => [c.status, c.n])) as Partial<Record<Status, number>>;
  const all = counts.reduce((a, c) => a + c.n, 0);

  const exportQs = buildQuery({ status, product, q, from: sp.from, to: sp.to }).toString();
  const pageHref = (p: number) => `/admin?${buildQuery({ ...sp, page: String(p) }).toString()}`;

  return (
    <AdminShell
      title="درخواست‌های مشاوره"
      current="/admin"
      actions={
        <a
          href={`/api/admin/export${exportQs ? `?${exportQs}` : ""}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elevated px-4 py-2 text-sm font-semibold hover:bg-bg"
        >
          <Download className="size-4" aria-hidden />
          خروجی CSV
        </a>
      }
    >
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="فیلتر وضعیت">
        <FilterChip href={`/admin?${buildQuery({ ...sp, status: undefined, page: undefined }).toString()}`} active={!status} label="همه" count={all} />
        {CONSULT_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin?${buildQuery({ ...sp, status: s, page: undefined }).toString()}`}
            active={status === s}
            label={STATUS_LABELS[s]}
            count={countBy[s] ?? 0}
          />
        ))}
      </nav>

      <form method="get" action="/admin" className="mb-5 grid gap-3 rounded-tile border border-line bg-bg-elevated p-4 sm:grid-cols-2 lg:grid-cols-5">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="text-xs text-fg-muted lg:col-span-2">
          جست‌وجو (نام، موبایل، کسب‌وکار)
          <div className="relative mt-1">
            <input name="q" defaultValue={q} className={`${inputClass} py-2 pl-10`} />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
          </div>
        </label>
        <label className="text-xs text-fg-muted">
          محصول
          <select name="product" defaultValue={product ?? ""} className={`${inputClass} mt-1 py-2`}>
            <option value="">همه</option>
            {Object.entries(PRODUCT_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-fg-muted">
          از تاریخ
          <input type="date" name="from" defaultValue={sp.from ?? ""} className={`${inputClass} mt-1 py-2`} />
        </label>
        <label className="text-xs text-fg-muted">
          تا تاریخ
          <input type="date" name="to" defaultValue={sp.to ?? ""} className={`${inputClass} mt-1 py-2`} />
        </label>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
          <button type="submit" className="rounded-full bg-fg px-5 py-2 text-sm font-bold text-bg hover:opacity-90">
            اعمال فیلتر
          </button>
          <Link href="/admin" className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-bg">
            پاک کردن
          </Link>
          <span className="mr-auto text-xs text-fg-muted">
            {toPersianDigits(total)} نتیجه · صفحه {toPersianDigits(page)} از {toPersianDigits(pages)}
          </span>
        </div>
      </form>

      <form action={bulkUpdateStatus} className="overflow-hidden rounded-tile border border-line bg-bg-elevated">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-bg px-4 py-2 text-xs">
          <span className="text-fg-muted">انتخاب‌شده‌ها →</span>
          {CONSULT_STATUSES.map((s) => (
            <button
              key={s}
              type="submit"
              name="status"
              value={s}
              className="rounded-full border border-line bg-bg-elevated px-3 py-1 font-medium hover:bg-fg hover:text-bg"
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-bg text-xs text-fg-muted">
              <tr>
                <th className="w-8 px-3 py-3" />
                <th className="px-3 py-3 text-right font-semibold">#</th>
                <th className="px-3 py-3 text-right font-semibold">تاریخ</th>
                <th className="px-3 py-3 text-right font-semibold">نام</th>
                <th className="px-3 py-3 text-right font-semibold">موبایل</th>
                <th className="px-3 py-3 text-right font-semibold">کسب‌وکار</th>
                <th className="px-3 py-3 text-right font-semibold">محصول</th>
                <th className="px-3 py-3 text-right font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-fg-muted">
                    درخواستی با این شرایط پیدا نشد.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-bg">
                  <td className="px-3 py-3">
                    <input type="checkbox" name="ids" value={r.id} className="size-4 accent-brand-red" aria-label={`انتخاب ${r.fullName}`} />
                  </td>
                  <td className="px-3 py-3 text-fg-faint">{toPersianDigits(r.id)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDateTimeFa(r.createdAt)}</td>
                  <td className="px-3 py-3 font-semibold">
                    <Link href={`/admin/requests/${r.id}`} className="underline-offset-4 hover:underline">
                      {r.fullName}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <a href={`tel:${r.phone}`} className="ltr-nums">
                      {formatMobileFa(r.phone)}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-fg-muted">{r.businessName ?? "—"}</td>
                  <td className="px-3 py-3">{PRODUCT_LABELS[r.product]}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
            <Link
              href={pageHref(Math.max(1, page - 1))}
              aria-disabled={page <= 1}
              className={cn("inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5", page <= 1 && "pointer-events-none opacity-40")}
            >
              <ChevronRight className="size-4" aria-hidden />
              قبلی
            </Link>
            <span className="text-fg-muted">
              {toPersianDigits(page)} / {toPersianDigits(pages)}
            </span>
            <Link
              href={pageHref(Math.min(pages, page + 1))}
              aria-disabled={page >= pages}
              className={cn("inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5", page >= pages && "pointer-events-none opacity-40")}
            >
              بعدی
              <ChevronLeft className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </form>
    </AdminShell>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active ? "border-fg bg-fg text-bg" : "border-line bg-bg-elevated hover:bg-bg",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-bg/20" : "bg-bg text-fg-muted")}>{toPersianDigits(count)}</span>
    </Link>
  );
}
