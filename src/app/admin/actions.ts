"use server";

import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db/client";
import { getSession, requireAdmin } from "@/lib/session";
import { loginSchema, notesSchema, statusSchema } from "@/lib/validation";

export type LoginState = { error?: string; username?: string };

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر", username };

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) {
    return {
      error:
        "ادمین پیکربندی نشده است: ADMIN_USERNAME یا ADMIN_PASSWORD در .env خالی است (اگر رمز $ دارد، مقدار را داخل کوتیشن تکی بگذار).",
      username,
    };
  }

  const ok = safeEqual(parsed.data.username, expectedUser) && safeEqual(parsed.data.password, expectedPass);
  if (!ok) return { error: "نام کاربری یا رمز عبور اشتباه است.", username };

  const session = await getSession();
  session.admin = { username: expectedUser, loggedInAt: Date.now() };
  await session.save();
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

export async function updateStatus(id: number, formData: FormData) {
  await requireAdmin();
  const status = statusSchema.parse(formData.get("status"));
  getDb()
    .update(schema.consultRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.consultRequests.id, id))
    .run();
  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${id}`);
}

export async function updateNotes(id: number, formData: FormData) {
  await requireAdmin();
  const notes = notesSchema.parse(formData.get("notes") ?? "");
  getDb()
    .update(schema.consultRequests)
    .set({ notes: notes || null, updatedAt: new Date() })
    .where(eq(schema.consultRequests.id, id))
    .run();
  revalidatePath(`/admin/requests/${id}`);
}
