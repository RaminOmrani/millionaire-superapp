"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { saveBanner, type BannerState } from "@/app/admin/banner-actions";
import { BannerCarousel } from "@/components/brand/BannerCarousel";
import { inputClass } from "@/components/ui/Field";
import type { BannerView } from "@/content/banners";
import type { Banner } from "@/db/schema";

interface Theme {
  value: string;
  label: string;
  accent: string;
  accent2: string;
  mark?: string;
  markLight?: string;
}

const toDateInput = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(d) : "";

export function BannerForm({ banner, themes }: { banner?: Banner; themes: Theme[] }) {
  const action = saveBanner.bind(null, banner?.id ?? null);
  const [state, formAction, pending] = useActionState(action, {} as BannerState);

  const [title, setTitle] = useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "");
  const [ctaLabel, setCtaLabel] = useState(banner?.ctaLabel ?? "");
  const [href, setHref] = useState(banner?.href ?? "");
  const [theme, setTheme] = useState(banner?.theme ?? "brand");
  const [placement, setPlacement] = useState<Banner["placement"]>(banner?.placement ?? "top");
  const [preview, setPreview] = useState<string | undefined>(banner?.image ? `/media/banners/${banner.image}` : undefined);
  const [removeImage, setRemoveImage] = useState(false);

  const view: BannerView = useMemo(() => {
    const t = themes.find((x) => x.value === theme) ?? themes[0]!;
    return {
      id: banner?.id ?? 0,
      title: title || undefined,
      subtitle: subtitle || undefined,
      ctaLabel: ctaLabel || undefined,
      href: href || undefined,
      external: /^https?:\/\//.test(href),
      image: removeImage ? undefined : preview,
      audience: "both",
      accent: t.accent,
      accent2: t.accent2,
      mark: t.mark,
      markLight: t.markLight,
    };
  }, [banner?.id, title, subtitle, ctaLabel, href, theme, preview, removeImage, themes]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7">
        {state.error && (
          <p role="alert" className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
            {state.error}
          </p>
        )}

        <section className="rounded-tile border border-line bg-bg-elevated p-6">
          <h2 className="font-bold">محتوا</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              تیتر
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={90} className={inputClass} />
            </label>
            <label className="text-sm sm:col-span-2">
              زیرتیتر
              <input name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={160} className={inputClass} />
            </label>
            <label className="text-sm">
              متن دکمه
              <input name="ctaLabel" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} maxLength={30} placeholder="مثلاً: مشاهده" className={inputClass} />
            </label>
            <label className="text-sm">
              لینک
              <input
                name="href"
                dir="ltr"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/crm یا https://…"
                className={`${inputClass} text-left`}
              />
            </label>
            <label className="text-sm">
              رنگ‌بندی و نشان
              <select name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className={inputClass}>
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              تصویر (اختیاری، PNG/JPG/WebP تا ۱٫۵ مگابایت)
              <input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPreview(URL.createObjectURL(f));
                    setRemoveImage(false);
                  }
                }}
                className={`${inputClass} py-2 text-sm file:ml-3 file:rounded-full file:border-0 file:bg-fg file:px-3 file:py-1 file:text-bg`}
              />
            </label>
            {preview && (
              <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" name="removeImage" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} className="size-4 accent-brand-red" />
                حذف تصویر فعلی
              </label>
            )}
          </div>
          <p className="mt-4 text-xs text-fg-muted">
            با تصویر و بدون تیتر، بنر فقط تصویر است. اندازه‌ی پیشنهادی: جایگاه بالا ۲۱۰۰×۵۰۰، میانه‌ی صفحه ۱۷۰۰×۵۰۰ پیکسل.
          </p>
        </section>

        <section className="rounded-tile border border-line bg-bg-elevated p-6">
          <h2 className="font-bold">نمایش</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm">
              جایگاه
              <select name="placement" value={placement} onChange={(e) => setPlacement(e.target.value as Banner["placement"])} className={inputClass}>
                <option value="top">بالای صفحه (بین جست‌وجو و آیکون‌ها)</option>
                <option value="middle">میانه‌ی صفحه (زیر آیکون‌ها)</option>
              </select>
            </label>
            <label className="text-sm">
              نمایش در
              <select name="audience" defaultValue={banner?.audience ?? "both"} className={inputClass}>
                <option value="both">سایت و اپ</option>
                <option value="web">فقط سایت</option>
                <option value="app">فقط اپ</option>
              </select>
            </label>
            <label className="text-sm">
              از تاریخ (اختیاری)
              <input name="startsAt" type="date" defaultValue={toDateInput(banner?.startsAt)} className={inputClass} />
            </label>
            <label className="text-sm">
              تا تاریخ (اختیاری)
              <input name="endsAt" type="date" defaultValue={toDateInput(banner?.endsAt)} className={inputClass} />
            </label>
            <label className="text-sm">
              ترتیب (عدد کمتر = اول)
              <input name="sort" type="number" defaultValue={banner?.sort ?? 0} className={inputClass} />
            </label>
            <label className="inline-flex items-center gap-2 self-end pb-3 text-sm">
              <input name="active" type="checkbox" defaultChecked={banner?.active ?? true} className="size-4 accent-brand-red" />
              فعال
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-bold text-bg transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
            ذخیره و انتشار
          </button>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="sticky top-6 space-y-3">
          <h2 className="text-sm font-bold text-fg-muted">پیش‌نمایش (تم تیره‌ی سایت)</h2>
          <div data-theme="dark" className="rounded-tile bg-bg p-4">
            {title || preview ? (
              <BannerCarousel banners={[view]} size={placement} />
            ) : (
              <p className="py-10 text-center text-sm text-fg-muted">تیتر یا تصویر وارد کنید</p>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
}
