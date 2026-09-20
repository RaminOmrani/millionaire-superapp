import { desc, gte, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { PRODUCT_LABELS, STATUS_LABELS } from "@/content/labels";
import { products } from "@/content/products";
import { getDb, schema } from "@/db/client";
import { CONSULT_STATUSES } from "@/db/schema";
import { formatDateFa } from "@/lib/format";
import { toPersianDigits } from "@/lib/persian-digits";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const DAYS = 30;

/** Data loading lives outside the component so the render stays pure (no Date.now() in render). */
function loadStats() {
  const db = getDb();
  const t = schema.consultRequests;
  const now = Date.now();
  const since = new Date(now - DAYS * 86_400_000);

  const total = db.select({ n: sql<number>`count(*)` }).from(t).get()?.n ?? 0;
  const recent = db.select({ n: sql<number>`count(*)` }).from(t).where(gte(t.createdAt, since)).get()?.n ?? 0;
  const byStatus = Object.fromEntries(
    db.select({ k: t.status, n: sql<number>`count(*)` }).from(t).groupBy(t.status).all().map((r) => [r.k, r.n]),
  ) as Record<string, number>;
  const byProduct = Object.fromEntries(
    db.select({ k: t.product, n: sql<number>`count(*)` }).from(t).groupBy(t.product).all().map((r) => [r.k, r.n]),
  ) as Record<string, number>;
  const perDay = db
    .select({ day: sql<string>`date(${t.createdAt}, 'unixepoch')`, n: sql<number>`count(*)` })
    .from(t)
    .where(gte(t.createdAt, since))
    .groupBy(sql`date(${t.createdAt}, 'unixepoch')`)
    .all();
  const dayMap = new Map(perDay.map((d) => [d.day, d.n]));
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(now - (DAYS - 1 - i) * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    return { date: d, n: dayMap.get(key) ?? 0 };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.n));
  const maxProduct = Math.max(1, ...Object.values(byProduct));
  const latestLogins = db.select().from(schema.loginAttempts).orderBy(desc(schema.loginAttempts.createdAt)).limit(8).all();
  return { total, recent, byStatus, byProduct, days, maxDay, maxProduct, latestLogins };
}

export default async function StatsPage() {
  await requireAdmin();
  const { total, recent, byStatus, byProduct, days, maxDay, maxProduct, latestLogins } = loadStats();
  const productKeys = [...products.map((p) => p.slug), "unknown"] as const;

  return (
    <AdminShell title="آمار" current="/admin/stats">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="کل درخواست‌ها" value={total} />
        <Tile label={`${toPersianDigits(DAYS)} روز اخیر`} value={recent} />
        {CONSULT_STATUSES.map((s) => (
          <Tile key={s} label={STATUS_LABELS[s]} value={byStatus[s] ?? 0} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <section className="rounded-tile border border-line bg-bg-elevated p-6 lg:col-span-7">
          <h2 className="font-bold">درخواست‌های روزانه ({toPersianDigits(DAYS)} روز اخیر)</h2>
          <div className="mt-6 flex h-40 items-end gap-1" role="img" aria-label="نمودار درخواست‌های روزانه">
            {days.map((d) => (
              <div key={d.date.toISOString()} className="group relative flex-1">
                <div
                  className="w-full rounded-t bg-brand-red/70 transition group-hover:bg-brand-red"
                  style={{ height: `${Math.max(2, (d.n / maxDay) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 text-[10px] text-bg group-hover:block">
                  {formatDateFa(d.date)}: {toPersianDigits(d.n)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-fg-faint">
            <span>{formatDateFa(days[0]!.date)}</span>
            <span>{formatDateFa(days[days.length - 1]!.date)}</span>
          </div>
        </section>

        <section className="rounded-tile border border-line bg-bg-elevated p-6 lg:col-span-5">
          <h2 className="font-bold">به تفکیک محصول</h2>
          <ul className="mt-5 space-y-3">
            {productKeys.map((k) => {
              const n = byProduct[k] ?? 0;
              return (
                <li key={k} className="text-sm">
                  <div className="flex justify-between">
                    <span>{PRODUCT_LABELS[k]}</span>
                    <span className="font-semibold">{toPersianDigits(n)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full bg-brand-red/70" style={{ width: `${(n / maxProduct) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-tile border border-line bg-bg-elevated p-6 lg:col-span-12">
          <h2 className="font-bold">آخرین ورودها به پنل</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-fg-muted">
              <tr>
                <th className="py-2 text-right font-semibold">زمان</th>
                <th className="py-2 text-right font-semibold">نام کاربری</th>
                <th className="py-2 text-right font-semibold">IP</th>
                <th className="py-2 text-right font-semibold">نتیجه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {latestLogins.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-fg-muted">
                    هنوز ورودی ثبت نشده.
                  </td>
                </tr>
              )}
              {latestLogins.map((l) => (
                <tr key={l.id}>
                  <td className="py-2">{formatDateFa(l.createdAt)}</td>
                  <td className="py-2">{l.username}</td>
                  <td className="ltr-nums py-2 text-fg-muted">{l.ip}</td>
                  <td className="py-2">{l.success ? "موفق" : <span className="text-brand-red">ناموفق</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-tile border border-line bg-bg-elevated p-5">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="display mt-2 text-3xl">{toPersianDigits(value)}</p>
    </div>
  );
}
