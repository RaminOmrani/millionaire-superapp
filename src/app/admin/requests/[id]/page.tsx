import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { deleteRequest, updateNotes, updateStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { inputClass } from "@/components/ui/Field";
import { PRODUCT_LABELS, STATUS_LABELS, TIME_LABELS } from "@/content/labels";
import { getDb, schema } from "@/db/client";
import { CONSULT_STATUSES } from "@/db/schema";
import { formatDateTimeFa, formatMobileFa } from "@/lib/format";
import { toPersianDigits } from "@/lib/persian-digits";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const row = getDb().select().from(schema.consultRequests).where(eq(schema.consultRequests.id, id)).get();
  if (!row) notFound();

  const setStatus = updateStatus.bind(null, id);
  const setNotes = updateNotes.bind(null, id);
  const remove = deleteRequest.bind(null, id);

  return (
    <AdminShell
      title={`درخواست ${toPersianDigits(id)}`}
      current="/admin"
      actions={
        <form action={remove}>
          <ConfirmSubmit
            message="این درخواست برای همیشه حذف شود؟"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-brand-red hover:bg-brand-red/5"
          >
            <Trash2 className="size-4" aria-hidden />
            حذف درخواست
          </ConfirmSubmit>
        </form>
      }
    >
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
        <ArrowRight className="size-4" aria-hidden />
        بازگشت به لیست
      </Link>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-tile border border-line bg-bg-elevated p-6 lg:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="display text-2xl">{row.fullName}</h2>
              <p className="mt-1 text-sm text-fg-muted">{formatDateTimeFa(row.createdAt)}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <Item label="موبایل">
              <a href={`tel:${row.phone}`} className="ltr-nums font-semibold">
                {formatMobileFa(row.phone)}
              </a>
            </Item>
            <Item label="کسب‌وکار">{row.businessName ?? "—"}</Item>
            <Item label="محصول موردنظر">{PRODUCT_LABELS[row.product]}</Item>
            <Item label="بهترین زمان تماس">{row.bestTime ? TIME_LABELS[row.bestTime] : "—"}</Item>
            <Item label="توضیحات" className="sm:col-span-2">
              <p className="whitespace-pre-wrap leading-7">{row.message ?? "—"}</p>
            </Item>
          </dl>
        </section>

        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-tile border border-line bg-bg-elevated p-6">
            <h3 className="font-bold">وضعیت</h3>
            <form action={setStatus} className="mt-4 flex flex-wrap gap-2">
              {CONSULT_STATUSES.map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  aria-pressed={row.status === s}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    row.status === s ? "border-fg bg-fg text-bg" : "border-line hover:bg-bg",
                  )}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </form>
          </section>

          <section className="rounded-tile border border-line bg-bg-elevated p-6">
            <h3 className="font-bold">یادداشت داخلی</h3>
            <form action={setNotes} className="mt-4 space-y-3">
              <textarea
                name="notes"
                rows={6}
                defaultValue={row.notes ?? ""}
                maxLength={4000}
                className={`${inputClass} resize-y`}
                aria-label="یادداشت"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-bold text-bg transition hover:opacity-90"
              >
                <Save className="size-4" aria-hidden />
                ذخیره یادداشت
              </button>
            </form>
            <p className="mt-3 text-xs text-fg-faint">آخرین تغییر: {formatDateTimeFa(row.updatedAt)}</p>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function Item({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-fg-faint">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
