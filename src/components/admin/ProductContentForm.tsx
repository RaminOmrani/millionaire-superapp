"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";
import { saveProductContent, type ContentState } from "@/app/admin/actions";
import { PlansEditor } from "@/components/admin/PlansEditor";
import { inputClass } from "@/components/ui/Field";
import { ACTION_LABELS, type ActionKey, type Product } from "@/content/products";
import type { ProductContentRow } from "@/db/schema";
import { ACTION_NOTE_MAX } from "@/lib/validation";

// Editable actions in hub order. `details` («امکانات و سطح‌بندی») is always on and links to the features page.
const ACTION_KEYS: ActionKey[] = ["panel", "support", "videos", "pricing", "ai"];

export function ProductContentForm({ base, row }: { base: Product; row: ProductContentRow | undefined }) {
  const action = saveProductContent.bind(null, base.slug);
  const [state, formAction, pending] = useActionState(action, {} as ContentState);

  const baseDetails = base.actions.find((a) => a.key === "details");
  const baseFeatures = baseDetails?.enabled && baseDetails.content ? baseDetails.content.join("\n") : "";
  // Only actions this product has (e.g. «ویدیوهای آموزشی» exists for some products only).
  const keys = ACTION_KEYS.filter((k) => base.actions.some((a) => a.key === k));

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p role="alert" className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="rounded-2xl border border-[#0048a8]/30 bg-[#0048a8]/10 px-4 py-3 text-sm text-[#0048a8]">
          ذخیره شد. سایت همین حالا به‌روز است.
        </p>
      )}

      <section className="rounded-tile border border-line bg-bg-elevated p-6">
        <h2 className="font-bold">اطلاعات محصول</h2>
        <p className="mt-1 text-xs text-fg-muted">فیلد خالی یعنی مقدار data.md استفاده می‌شود.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm">
            وضعیت
            <select name="status" defaultValue={row?.status ?? ""} className={inputClass}>
              <option value="">پیش‌فرض ({base.status === "active" ? "فعال" : "به‌زودی"})</option>
              <option value="active">فعال</option>
              <option value="coming_soon">به‌زودی</option>
            </select>
          </label>
          <label className="text-sm">
            برچسب روی آیکون (حداکثر ۱۶ حرف، مثلاً «جدید»)
            <input name="badge" defaultValue={row?.badge ?? ""} maxLength={16} placeholder="خالی = بدون برچسب" className={inputClass} />
          </label>
          <label className="text-sm">
            نسخه فعلی
            <input name="version" defaultValue={row?.version ?? ""} placeholder={base.version ?? "—"} className={inputClass} />
          </label>
          <label className="text-sm sm:col-span-2">
            وب‌سایت
            <input
              name="website"
              dir="ltr"
              defaultValue={row?.website ?? ""}
              placeholder={base.website ?? "https://"}
              className={`${inputClass} text-left`}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            توضیح
            <textarea
              name="description"
              rows={4}
              defaultValue={row?.description ?? ""}
              placeholder={base.description ?? "—"}
              className={`${inputClass} resize-y`}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            ویژگی‌های کلیدی (هر خط یک مورد؛ در صفحه‌ی «امکانات و سطح‌بندی» نمایش داده می‌شود)
            <textarea
              name="features"
              rows={6}
              defaultValue={row?.features?.join("\n") ?? ""}
              placeholder={baseFeatures || "مثلاً: صدور فاکتور رسمی"}
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>
      </section>

      <section className="rounded-tile border border-line bg-bg-elevated p-6">
        <h2 className="font-bold">دسترسی‌ها</h2>
        <p className="mt-1 text-xs text-fg-muted">
          «پیش‌فرض» یعنی طبق data.md. فعال کردن آیتمی که لینک یا محتوا ندارد، کارت را بدون لینک نشان می‌دهد.
          کارت «{ACTION_LABELS.details}» همیشه فعال است و به صفحه‌ی امکانات این محصول می‌رود؛ محتوایش از توضیح، ویژگی‌های
          کلیدی و پلن‌ها ساخته می‌شود.
        </p>
        <div className="mt-5 grid gap-4">
          {keys.map((key) => {
            const b = base.actions.find((a) => a.key === key);
            const ov = row?.actions?.[key];
            const baseState = b?.enabled ? "فعال" : "قفل";
            return (
              <fieldset key={key} className="grid gap-3 rounded-2xl border border-line bg-bg p-4 sm:grid-cols-2">
                <legend className="px-2 text-sm font-semibold">{ACTION_LABELS[key]}</legend>
                <label className="text-sm">
                  وضعیت
                  <select
                    name={`action.${key}.mode`}
                    defaultValue={ov?.enabled === true ? "on" : ov?.enabled === false ? "off" : "default"}
                    className={inputClass}
                  >
                    <option value="default">پیش‌فرض ({baseState})</option>
                    <option value="on">فعال</option>
                    <option value="off">قفل (به‌زودی)</option>
                  </select>
                </label>
                <label className="text-sm">
                  لینک
                  <input
                    name={`action.${key}.href`}
                    dir="ltr"
                    defaultValue={ov?.href ?? ""}
                    placeholder={b?.enabled && b.href ? b.href : "https://"}
                    className={`${inputClass} text-left`}
                  />
                </label>
                <label className="text-sm">
                  یادداشت کوتاه زیر کارت
                  <input name={`action.${key}.note`} maxLength={ACTION_NOTE_MAX} defaultValue={ov?.note ?? ""} placeholder={b?.enabled && b.note ? b.note : "—"} className={inputClass} />
                </label>
                <label className="text-sm">
                  {key === "pricing" ? "نام پکیج‌ها وقتی پلنی تعریف نشده (هر خط یک مورد)" : "محتوای داخل کارت (هر خط یک مورد)"}
                  <textarea
                    name={`action.${key}.content`}
                    rows={2}
                    defaultValue={ov?.content?.join("\n") ?? ""}
                    placeholder={b?.enabled && b.content ? b.content.join("، ") : "—"}
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </fieldset>
            );
          })}
        </div>
      </section>

      <section className="rounded-tile border border-line bg-bg-elevated p-6">
        <h2 className="font-bold">پلن‌های قیمت‌گذاری</h2>
        <p className="mt-1 text-xs text-fg-muted">
          با تعریف حداقل یک پلن، «خرید و تعرفه‌ها» خودکار فعال می‌شود و پلن‌ها در بخش «سطح‌بندی و پکیج‌ها» صفحه‌ی امکانات به‌صورت کارت نمایش داده می‌شوند.
        </p>
        <div className="mt-5">
          <PlansEditor initial={row?.plans ?? []} />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-bold text-bg transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
          ذخیره و انتشار
        </button>
      </div>
    </form>
  );
}
