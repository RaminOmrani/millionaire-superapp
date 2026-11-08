import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, required, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold">
        {label}
        {required && (
          <span className="mr-1 text-brand-red-light" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-[#ff8a8a] light:text-brand-red" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-fg-faint">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "block w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-base text-fg placeholder:text-fg-faint transition focus:border-fg/40 focus:bg-bg aria-[invalid=true]:border-[#ff8a8a] light:bg-bg-elevated";
