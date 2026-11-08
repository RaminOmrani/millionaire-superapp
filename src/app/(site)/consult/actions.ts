"use server";

import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import { PRODUCT_LABELS, TIME_LABELS } from "@/content/labels";
import { mailConfigured, sendMail } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { consultSchema, type ConsultValues } from "@/lib/validation";

export type ConsultState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<string, string>>;
      /** Echo of what was submitted so the form keeps the user's input */
      values: Record<string, string>;
    }
  | { status: "success"; id: number };

export async function submitConsult(_prev: ConsultState, formData: FormData): Promise<ConsultState> {
  const raw = Object.fromEntries(formData.entries());
  const values = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => k !== "website" && typeof v === "string") as [string, string][],
  );
  const parsed = consultSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "لطفاً موارد مشخص‌شده را اصلاح کنید.", fieldErrors, values };
  }

  const v = parsed.data;
  // Honeypot filled → pretend success without storing.
  if (v.website) return { status: "success", id: 0 };

  const ip = await clientIp();
  const limited = rateLimit(`consult:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return { status: "error", message: "تعداد درخواست‌ها زیاد است. چند دقیقه‌ی دیگر دوباره تلاش کنید.", values };
  }

  try {
    const row = getDb()
      .insert(schema.consultRequests)
      .values({
        fullName: v.fullName,
        phone: v.phone,
        businessName: v.businessName,
        product: v.product,
        message: v.message,
        bestTime: v.bestTime,
      })
      .returning({ id: schema.consultRequests.id })
      .get();
    void notifyAdmin(row?.id ?? 0, v);
    return { status: "success", id: row?.id ?? 0 };
  } catch (err) {
    console.error("consult insert failed", err);
    return { status: "error", message: "ثبت درخواست ممکن نشد. لطفاً دوباره تلاش کنید یا تماس بگیرید.", values };
  }
}

/** Fire-and-forget e-mail to the address saved in admin settings (needs SMTP_* env). */
async function notifyAdmin(id: number, v: ConsultValues) {
  try {
    if (!mailConfigured()) return;
    const to = getDb().select().from(schema.settings).where(eq(schema.settings.key, "notify_email")).get()?.value;
    if (!to) return;
    const lines = [
      `درخواست مشاوره #${id}`,
      `نام: ${v.fullName}`,
      `موبایل: ${v.phone}`,
      `کسب‌وکار: ${v.businessName ?? "-"}`,
      `محصول: ${PRODUCT_LABELS[v.product]}`,
      `زمان تماس: ${v.bestTime ? TIME_LABELS[v.bestTime] : "-"}`,
      "",
      v.message ?? "",
      "",
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/requests/${id}`,
    ];
    await sendMail(to, `درخواست مشاوره جدید — ${v.fullName}`, lines.join("\n"));
  } catch (err) {
    console.error("notify mail failed", err);
  }
}
