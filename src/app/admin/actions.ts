"use server";

import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb, schema } from "@/db/client";
import { products, type ActionKey, type ProductSlug } from "@/content/products";
import { adminConfigured, checkAdminCredentials, hashPassword, loginThrottled, recordLogin, setSetting } from "@/lib/auth";
import { clientIp } from "@/lib/rate-limit";
import { getSession, requireAdmin } from "@/lib/session";
import { loginSchema, notesSchema, statusSchema } from "@/lib/validation";

/* ---------------- auth ---------------- */

export type LoginState = { error?: string; username?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر", username };

  if (!adminConfigured()) {
    return {
      error:
        "ادمین پیکربندی نشده است: ADMIN_USERNAME یا ADMIN_PASSWORD در .env خالی است (اگر رمز $ دارد، مقدار را داخل کوتیشن تکی بگذار).",
      username,
    };
  }

  const ip = await clientIp();
  if (loginThrottled(ip)) {
    return { error: "تلاش‌های ناموفق زیاد بوده است. ۱۵ دقیقه‌ی دیگر دوباره امتحان کنید.", username };
  }

  const ok = checkAdminCredentials(parsed.data.username, parsed.data.password);
  recordLogin(ip, parsed.data.username, ok);
  if (!ok) return { error: "نام کاربری یا رمز عبور اشتباه است.", username };

  const session = await getSession();
  session.admin = { username: parsed.data.username, loggedInAt: Date.now() };
  await session.save();
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

/* ---------------- consult requests ---------------- */

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

export async function deleteRequest(id: number) {
  await requireAdmin();
  getDb().delete(schema.consultRequests).where(eq(schema.consultRequests.id, id)).run();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function bulkUpdateStatus(formData: FormData) {
  await requireAdmin();
  const status = statusSchema.parse(formData.get("status"));
  const ids = formData
    .getAll("ids")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
  if (ids.length > 0) {
    getDb()
      .update(schema.consultRequests)
      .set({ status, updatedAt: new Date() })
      .where(inArray(schema.consultRequests.id, ids))
      .run();
  }
  revalidatePath("/admin");
}

/* ---------------- product content ---------------- */

const ACTION_KEYS: ActionKey[] = ["panel", "support", "pricing", "details", "ai"];

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/"), "لینک باید با http(s):// شروع شود.");

const planSchema = z.object({
  name: z.string().trim().min(1).max(80),
  price: z.string().trim().min(1).max(60),
  period: z.string().trim().max(40).optional(),
  features: z.array(z.string().trim().min(1).max(160)).max(20),
  href: optionalUrl.optional(),
  highlight: z.boolean().optional(),
});

export type ContentState = { ok?: boolean; error?: string };

export async function saveProductContent(slug: ProductSlug, _prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  if (!products.some((p) => p.slug === slug)) return { error: "محصول نامعتبر" };

  try {
    const statusRaw = String(formData.get("status") ?? "");
    const status = statusRaw === "active" || statusRaw === "coming_soon" ? statusRaw : null;
    const description = String(formData.get("description") ?? "").trim() || null;
    const website = optionalUrl.parse(formData.get("website") ?? "") || null;
    const version = String(formData.get("version") ?? "").trim() || null;
    const features = lines(formData.get("features"));

    const actions: Record<string, { enabled?: boolean; href?: string | null; note?: string | null; content?: string[] }> = {};
    for (const key of ACTION_KEYS) {
      const mode = String(formData.get(`action.${key}.mode`) ?? "default"); // default | on | off
      const href = optionalUrl.parse(formData.get(`action.${key}.href`) ?? "");
      const note = String(formData.get(`action.${key}.note`) ?? "").trim();
      const content = lines(formData.get(`action.${key}.content`));
      const ov: (typeof actions)[string] = {};
      if (mode === "on") ov.enabled = true;
      if (mode === "off") ov.enabled = false;
      if (href) ov.href = href;
      if (note) ov.note = note;
      if (content.length) ov.content = content;
      if (Object.keys(ov).length) actions[key] = ov;
    }

    const plansRaw = String(formData.get("plans") ?? "[]");
    const plans = z.array(planSchema).max(8).parse(JSON.parse(plansRaw || "[]"));

    getDb()
      .insert(schema.productContent)
      .values({
        slug,
        status,
        description,
        website,
        version,
        features: features.length ? features : null,
        actions: Object.keys(actions).length ? actions : null,
        plans: plans.length ? plans : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.productContent.slug,
        set: {
          status,
          description,
          website,
          version,
          features: features.length ? features : null,
          actions: Object.keys(actions).length ? actions : null,
          plans: plans.length ? plans : null,
          updatedAt: new Date(),
        },
      })
      .run();
  } catch (err) {
    const msg = err instanceof z.ZodError ? (err.issues[0]?.message ?? "ورودی نامعتبر") : "ذخیره ممکن نشد.";
    return { error: msg };
  }

  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${slug}`);
  return { ok: true };
}

export async function resetProductContent(slug: ProductSlug) {
  await requireAdmin();
  getDb().delete(schema.productContent).where(eq(schema.productContent.slug, slug)).run();
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${slug}`);
}

export async function toggleProductStatus(slug: ProductSlug, formData: FormData) {
  await requireAdmin();
  const statusRaw = String(formData.get("status") ?? "");
  const status = statusRaw === "active" || statusRaw === "coming_soon" ? statusRaw : null;
  getDb()
    .insert(schema.productContent)
    .values({ slug, status, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.productContent.slug, set: { status, updatedAt: new Date() } })
    .run();
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/products");
}

/* ---------------- settings ---------------- */

export type SettingsState = { ok?: string; error?: string };

export async function changePassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const admin = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!checkAdminCredentials(admin.username, current)) return { error: "رمز فعلی اشتباه است." };
  if (next.length < 10) return { error: "رمز جدید باید حداقل ۱۰ کاراکتر باشد." };
  if (next !== confirm) return { error: "تکرار رمز جدید مطابقت ندارد." };
  setSetting("password_hash", hashPassword(next));
  return { ok: "رمز عبور عوض شد. از این به بعد رمز جدید معتبر است (ADMIN_PASSWORD در .env دیگر استفاده نمی‌شود)." };
}

export async function saveNotifyEmail(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim();
  if (email && !z.email().safeParse(email).success) return { error: "ایمیل معتبر نیست." };
  setSetting("notify_email", email);
  return { ok: email ? "ایمیل اعلان ذخیره شد." : "اعلان ایمیلی غیرفعال شد." };
}
