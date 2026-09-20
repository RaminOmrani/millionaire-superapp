import { desc, eq } from "drizzle-orm";
import { PRODUCT_LABELS, STATUS_LABELS, TIME_LABELS } from "@/content/labels";
import { getDb, schema } from "@/db/client";
import { CONSULT_STATUSES } from "@/db/schema";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function csvCell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** GET /api/admin/export?status=new — CSV download (UTF-8 with BOM for Excel). */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session.admin) return new Response("Unauthorized", { status: 401 });

  const status = new URL(request.url).searchParams.get("status");
  const filter = status && (CONSULT_STATUSES as readonly string[]).includes(status) ? (status as (typeof CONSULT_STATUSES)[number]) : undefined;

  const t = schema.consultRequests;
  const rows = getDb()
    .select()
    .from(t)
    .where(filter ? eq(t.status, filter) : undefined)
    .orderBy(desc(t.createdAt))
    .all();

  const header = ["شناسه", "تاریخ ثبت", "نام", "موبایل", "کسب‌وکار", "محصول", "بهترین زمان تماس", "توضیحات", "وضعیت", "یادداشت", "آخرین تغییر"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.createdAt.toISOString(),
        r.fullName,
        r.phone,
        r.businessName,
        PRODUCT_LABELS[r.product],
        r.bestTime ? TIME_LABELS[r.bestTime] : "",
        r.message,
        STATUS_LABELS[r.status],
        r.notes,
        r.updatedAt.toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const body = "﻿" + lines.join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="consult-requests-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
