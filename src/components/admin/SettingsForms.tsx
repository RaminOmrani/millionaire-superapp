"use client";

import { KeyRound, LoaderCircle, Mail } from "lucide-react";
import { useActionState } from "react";
import { changePassword, saveNotifyEmail, type SettingsState } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/ui/Field";

function Notice({ state }: { state: SettingsState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
        {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p role="status" className="rounded-2xl border border-[#0048a8]/30 bg-[#0048a8]/10 px-4 py-3 text-sm text-[#0048a8]">
        {state.ok}
      </p>
    );
  return null;
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {} as SettingsState);
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <Field label="رمز فعلی" htmlFor="current" required>
        <input id="current" name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="رمز جدید" htmlFor="next" required hint="حداقل ۱۰ کاراکتر">
        <input id="next" name="next" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
      </Field>
      <Field label="تکرار رمز جدید" htmlFor="confirm" required>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-bold text-bg hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
        تغییر رمز
      </button>
    </form>
  );
}

export function NotifyEmailForm({ initial, smtpReady }: { initial: string; smtpReady: boolean }) {
  const [state, action, pending] = useActionState(saveNotifyEmail, {} as SettingsState);
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      {!smtpReady && (
        <p className="rounded-2xl border border-line bg-bg px-4 py-3 text-xs text-fg-muted">
          ارسال ایمیل هنوز پیکربندی نشده: مقادیر SMTP_* را در .env سرور بگذار (نمونه در .env.example). تا آن موقع این آدرس فقط ذخیره می‌شود.
        </p>
      )}
      <Field label="ایمیل دریافت اعلان درخواست جدید" htmlFor="email" hint="خالی = بدون اعلان">
        <input id="email" name="email" type="email" dir="ltr" defaultValue={initial} className={`${inputClass} text-left`} />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-bold text-bg hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Mail className="size-4" aria-hidden />}
        ذخیره
      </button>
    </form>
  );
}
