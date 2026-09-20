"use client";

import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { submitConsult, type ConsultState } from "@/app/(site)/consult/actions";
import { PRODUCT_LABELS, TIME_LABELS } from "@/content/labels";
import { Field, inputClass } from "@/components/ui/Field";
import { toPersianDigits } from "@/lib/persian-digits";

const initial: ConsultState = { status: "idle" };

export function ConsultForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [state, action, pending] = useActionState(submitConsult, initial);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? state.values : {};

  if (state.status === "success") {
    return (
      <div className="grain flex min-h-72 flex-col items-center justify-center rounded-tile border border-line bg-surface p-10 text-center">
        <CheckCircle2 className="size-10 text-[var(--ring)]" aria-hidden />
        <h2 className="display mt-4 text-2xl">درخواست شما ثبت شد</h2>
        <p className="mt-2 max-w-sm text-sm text-fg-muted">
          کارشناسان ما در ساعات کاری با شما تماس می‌گیرند.
          {state.id > 0 && (
            <>
              {" "}
              شماره پیگیری: <span className="ltr-nums font-bold text-fg">{toPersianDigits(state.id)}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grain rounded-tile border border-line bg-surface p-6 sm:p-8">
      {state.status === "error" && !Object.keys(errors).length && (
        <p role="alert" className="mb-6 rounded-2xl border border-[#ff8a8a]/40 bg-[#ff8a8a]/10 px-4 py-3 text-sm">
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="نام و نام خانوادگی" htmlFor="fullName" required error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            defaultValue={values.fullName ?? ""}
            aria-invalid={!!errors.fullName}
            className={inputClass}
          />
        </Field>

        <Field label="شماره موبایل" htmlFor="phone" required error={errors.phone} hint="مثال: ۰۹۱۵xxxxxxx">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            required
            defaultValue={values.phone ?? ""}
            aria-invalid={!!errors.phone}
            className={`${inputClass} text-left`}
          />
        </Field>

        <Field label="نام کسب‌وکار" htmlFor="businessName" error={errors.businessName}>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            defaultValue={values.businessName ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="محصول موردنظر" htmlFor="product" required error={errors.product}>
          <select
            id="product"
            name="product"
            required
            defaultValue={values.product ?? defaultProduct}
            aria-invalid={!!errors.product}
            className={inputClass}
          >
            <option value="" disabled>
              انتخاب کنید…
            </option>
            {Object.entries(PRODUCT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="توضیحات" htmlFor="message" error={errors.message} className="sm:col-span-2">
          <textarea id="message" name="message" rows={4} defaultValue={values.message ?? ""} className={`${inputClass} resize-y`} />
        </Field>

        <Field label="بهترین زمان تماس" htmlFor="bestTime" error={errors.bestTime}>
          <select id="bestTime" name="bestTime" defaultValue={values.bestTime ?? ""} className={inputClass}>
            <option value="">فرقی نمی‌کند</option>
            {Object.entries(TIME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        {/* Honeypot: hidden from people, filled by bots */}
        <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="website">وب‌سایت</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-xs text-fg-faint">فیلدهای ستاره‌دار الزامی هستند.</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-base font-bold text-white shadow-[0_8px_30px_-10px_var(--color-brand-red)] transition hover:bg-brand-red-light active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          ثبت درخواست
        </button>
      </div>
    </form>
  );
}
