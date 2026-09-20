"use server";

import { getDb, schema } from "@/db/client";
import { consultSchema } from "@/lib/validation";

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
    return { status: "success", id: row?.id ?? 0 };
  } catch (err) {
    console.error("consult insert failed", err);
    return { status: "error", message: "ثبت درخواست ممکن نشد. لطفاً دوباره تلاش کنید یا تماس بگیرید.", values };
  }
}
