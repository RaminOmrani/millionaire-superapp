"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BANNER_THEMES } from "@/content/banners";
import { getDb, schema } from "@/db/client";
import { BANNER_AUDIENCES, BANNER_PLACEMENTS } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { deleteUpload, saveUpload } from "@/lib/uploads";

export type BannerState = { error?: string };

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v ? v : null));

const bannerSchema = z
  .object({
    title: text(90),
    subtitle: text(160),
    ctaLabel: text(30),
    href: z
      .string()
      .trim()
      .max(500)
      .refine((v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/"), "لینک باید با https:// یا / شروع شود.")
      .transform((v) => (v ? v : null)),
    theme: z.string().refine((v) => BANNER_THEMES.some((t) => t.value === v), "رنگ‌بندی نامعتبر"),
    placement: z.enum(BANNER_PLACEMENTS),
    audience: z.enum(BANNER_AUDIENCES),
    sort: z.coerce.number().int().min(-999).max(999),
    active: z.boolean(),
    startsAt: z.string().transform((v) => (v ? new Date(`${v}T00:00:00+03:30`) : null)),
    endsAt: z.string().transform((v) => (v ? new Date(`${v}T23:59:59+03:30`) : null)),
  })
  .refine((v) => !v.startsAt || !v.endsAt || v.startsAt <= v.endsAt, "تاریخ پایان باید بعد از شروع باشد.");

function revalidateBanners() {
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function saveBanner(id: number | null, _prev: BannerState, formData: FormData): Promise<BannerState> {
  await requireAdmin();
  const parsed = bannerSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    ctaLabel: String(formData.get("ctaLabel") ?? ""),
    href: String(formData.get("href") ?? ""),
    theme: String(formData.get("theme") ?? "brand"),
    placement: String(formData.get("placement") ?? "top"),
    audience: String(formData.get("audience") ?? "both"),
    sort: String(formData.get("sort") ?? "0"),
    active: formData.get("active") === "on",
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر" };

  const db = getDb();
  const existing = id ? db.select().from(schema.banners).where(eq(schema.banners.id, id)).get() : undefined;
  if (id && !existing) return { error: "بنر پیدا نشد." };

  let image = existing?.image ?? null;
  const file = formData.get("image");
  try {
    if (file instanceof File && file.size > 0) {
      const saved = await saveUpload("banners", file);
      await deleteUpload("banners", image);
      image = saved;
    } else if (formData.get("removeImage") === "on") {
      await deleteUpload("banners", image);
      image = null;
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "آپلود تصویر ممکن نشد." };
  }

  if (!image && !parsed.data.title) return { error: "بنر باید حداقل تیتر یا تصویر داشته باشد." };

  const values = { ...parsed.data, image, updatedAt: new Date() };
  if (existing) db.update(schema.banners).set(values).where(eq(schema.banners.id, existing.id)).run();
  else db.insert(schema.banners).values(values).run();

  revalidateBanners();
  redirect("/admin/banners");
}

export async function deleteBanner(id: number) {
  await requireAdmin();
  const db = getDb();
  const row = db.select().from(schema.banners).where(eq(schema.banners.id, id)).get();
  if (row) {
    await deleteUpload("banners", row.image);
    db.delete(schema.banners).where(eq(schema.banners.id, id)).run();
  }
  revalidateBanners();
  redirect("/admin/banners");
}

export async function toggleBanner(id: number) {
  await requireAdmin();
  const db = getDb();
  const row = db.select().from(schema.banners).where(eq(schema.banners.id, id)).get();
  if (row) db.update(schema.banners).set({ active: !row.active, updatedAt: new Date() }).where(eq(schema.banners.id, id)).run();
  revalidateBanners();
}
