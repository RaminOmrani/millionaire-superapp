import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import { PRODUCT_LABELS, STATUS_LABELS, TIME_LABELS } from "@/content/labels";
import { getDb, schema } from "@/db/client";
import { CONSULT_PRODUCTS, CONSULT_STATUSES } from "@/db/schema";
import { toLatinDigits } from "@/lib/persian-digits";
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

  const sp = new URL(request.url).searchParams;
  const t = schema.consultRequests;
  const where: SQL[] = [];
  const status = sp.get("status");
  if (status && (CONSULT_STATUSES as readonly string[]).includes(status)) where.push(eq(t.status, status as (typeof CONSULT_STATUSES)[number]));
  const product = sp.get("product");
  if (product && (CONSULT_PRODUCTS as readonly string[]).includes(product)) where.push(eq(t.product, product as (typeof CONSULT_PRODUCTS)[number]));
  const q = (sp.get("q") ?? "").trim();
  if (q) where.push(or(like(t.fullName, `%${q}%`), like(t.businessName, `%${q}%`), like(t.phone, `%${toLatinDigits(q)}%`))!);
  const from = sp.get("from");
  if (from && !Number.isNaN(new Date(from).getTime())) where.push(gte(t.createdAt, new Date(from)));
  const to = sp.get("to");
  if (to && !Number.isNaN(new Date(to).getTime())) where.push(lte(t.createdAt, new Date(new Date(to).getTime() + 86_400_000)));

  const rows = getDb()
    .select()
    .from(t)
    .where(where.length ? and(...where) : undefined)
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
