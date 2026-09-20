import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { Download } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PRODUCT_LABELS, STATUS_LABELS } from "@/content/labels";
import { getDb, schema } from "@/db/client";
import { CONSULT_STATUSES } from "@/db/schema";
import { formatDateTimeFa, formatMobileFa } from "@/lib/format";
import { toPersianDigits } from "@/lib/persian-digits";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Status = (typeof CONSULT_STATUSES)[number];

function isStatus(v: string | undefined): v is Status {
  return !!v && (CONSULT_STATUSES as readonly string[]).includes(v);
}

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = isStatus(status) ? status : undefined;

  const db = getDb();
  const t = schema.consultRequests;

  const rows = db
    .select()
    .from(t)
    .where(filter ? eq(t.status, filter) : undefined)
    .orderBy(desc(t.createdAt))
    .limit(500)
    .all();

  const counts = db
    .select({ status: t.status, n: sql<number>`count(*)` })
    .from(t)
    .groupBy(t.status)
    .all();
  const countBy = Object.fromEntries(counts.map((c) => [c.status, c.n])) as Partial<Record<Status, number>>;
  const total = counts.reduce((a, c) => a + c.n, 0);

  return (
    <AdminShell title="درخواست‌های مشاوره">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="فیلتر وضعیت">
          <FilterChip href="/admin" active={!filter} label="همه" count={total} />
          {CONSULT_STATUSES.map((s) => (
            <FilterChip key={s} href={`/admin?status=${s}`} active={filter === s} label={STATUS_LABELS[s]} count={countBy[s] ?? 0} />
          ))}
        </nav>
        <a
          href={`/api/admin/export${filter ? `?status=${filter}` : ""}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elevated px-4 py-2 text-sm font-semibold hover:bg-bg"
        >
          <Download className="size-4" aria-hidden />
          خروجی CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-tile border border-line bg-bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-bg text-xs text-fg-muted">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">#</th>
                <th className="px-4 py-3 text-right font-semibold">تاریخ</th>
                <th className="px-4 py-3 text-right font-semibold">نام</th>
                <th className="px-4 py-3 text-right font-semibold">موبایل</th>
                <th className="px-4 py-3 text-right font-semibold">کسب‌وکار</th>
                <th className="px-4 py-3 text-right font-semibold">محصول</th>
                <th className="px-4 py-3 text-right font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-fg-muted">
                    درخواستی ثبت نشده است.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-bg">
                  <td className="px-4 py-3 text-fg-faint">{toPersianDigits(r.id)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDateTimeFa(r.createdAt)}</td>
                  <td className="px-4 py-3 font-semibold">
                    <Link href={`/admin/requests/${r.id}`} className="underline-offset-4 hover:underline">
                      {r.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${r.phone}`} className="ltr-nums">
                      {formatMobileFa(r.phone)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{r.businessName ?? "—"}</td>
                  <td className="px-4 py-3">{PRODUCT_LABELS[r.product]}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-bg/20" : "bg-bg text-fg-muted")}>
        {toPersianDigits(count)}
      </span>
    </Link>
  );
}
