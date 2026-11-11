"use client";

import { Eraser, KeyRound, LoaderCircle, Mail, Save } from "lucide-react";
import { useActionState, useState } from "react";
import { changePassword, saveClub, saveNotifyEmail, type ClubState, type SettingsState } from "@/app/admin/actions";
import { toPersianDigits } from "@/lib/persian-digits";
import { CLUB_DEFAULT_TITLE, CLUB_TEXT_MAX, CLUB_TITLE_MAX } from "@/lib/club";
import type { ClubValues } from "@/lib/validation";
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

/**
 * Customer-club section of the landing. Fields are uncontrolled and re-keyed on every action result,
 * so after save/clear/error they show exactly what the server echoed back (React resets forms after actions).
 */
export function ClubForm({ initial }: { initial: ClubValues }) {
  const [state, action, pending] = useActionState(saveClub, {} as ClubState);
  const values = state.values ?? initial;
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <ClubFields key={state.at ?? 0} values={values} />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-bold text-bg hover:opacity-90 disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
          ذخیره
        </button>
        <button
          type="submit"
          name="intent"
          value="clear"
          disabled={pending}
          formNoValidate
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-bold text-fg-muted hover:border-fg/30 hover:text-fg disabled:opacity-60"
        >
          <Eraser className="size-4" aria-hidden />
          پاک کردن و پنهان کردن بخش
        </button>
      </div>
    </form>
  );
}

function ClubFields({ values }: { values: ClubValues }) {
  // Only the counter is client state; the textarea stays uncontrolled.
  const [length, setLength] = useState(values.text.length);
  return (
    <>
      <Field label="عنوان" htmlFor="club-title" hint={`خالی = «${CLUB_DEFAULT_TITLE}»`}>
        <input
          id="club-title"
          name="title"
          type="text"
          maxLength={CLUB_TITLE_MAX}
          defaultValue={values.title}
          placeholder={CLUB_DEFAULT_TITLE}
          className={inputClass}
        />
      </Field>
      <Field label="متن کوتاه" htmlFor="club-text" hint="تا متن خالی است، این بخش در صفحه‌ی اول نمایش داده نمی‌شود">
        <textarea
          id="club-text"
          name="text"
          rows={4}
          maxLength={CLUB_TEXT_MAX}
          defaultValue={values.text}
          onInput={(e) => setLength(e.currentTarget.value.length)}
          aria-describedby="club-text-count"
          className={`${inputClass} resize-y leading-7`}
        />
        <p id="club-text-count" className="text-left text-xs text-fg-faint" aria-live="polite">
          {toPersianDigits(length)} / {toPersianDigits(CLUB_TEXT_MAX)}
        </p>
      </Field>
      <Field label="لینک «اطلاعات بیشتر»" htmlFor="club-href" hint="اختیاری؛ آدرس کامل (با https) یا مسیری از همین سایت که با / شروع شود. خالی = بدون دکمه">
        <input
          id="club-href"
          name="href"
          type="text"
          inputMode="url"
          dir="ltr"
          maxLength={500}
          defaultValue={values.href}
          placeholder="https://"
          className={`${inputClass} text-left`}
        />
      </Field>
    </>
  );
}
