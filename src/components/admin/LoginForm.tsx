"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/ui/Field";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
          {state.error}
        </p>
      )}
      <Field label="نام کاربری" htmlFor="username" required>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          defaultValue={state.username ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="رمز عبور" htmlFor="password" required>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-red-light disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
        ورود
      </button>
    </form>
  );
}
