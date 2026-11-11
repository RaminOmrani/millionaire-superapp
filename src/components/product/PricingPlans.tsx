import { Check, ExternalLink, Star } from "lucide-react";
import type { PricingPlan } from "@/db/schema";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

/** Admin-managed pricing plans as cards (features & tiers page). */
export function PricingPlans({ plans, note }: { plans: readonly PricingPlan[]; note?: string }) {
  const n = plans.length;
  const cols =
    n === 1 ? "sm:max-w-sm" : n === 2 ? "sm:grid-cols-2 lg:max-w-3xl" : n === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4", cols)}>
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "grain relative flex flex-col overflow-hidden rounded-tile border p-6",
            plan.highlight
              ? "border-[color-mix(in_oklab,var(--glow)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface))] shadow-[0_30px_70px_-34px_var(--glow)]"
              : "border-line bg-surface",
          )}
        >
          {plan.highlight && (
            <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1 rounded-full bg-fg px-2.5 py-0.5 text-[11px] font-bold text-bg">
              <Star className="size-3" aria-hidden />
              پیشنهاد ما
            </span>
          )}
          <h3 className={cn("text-lg font-bold", plan.highlight && "pl-24")}>{plan.name}</h3>
          <p className="mt-3">
            <span className="display text-3xl">{toPersianDigits(plan.price)}</span>
            {plan.period && <span className="mr-1 text-xs text-fg-faint">/ {plan.period}</span>}
          </p>
          {plan.features.length > 0 && (
            <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5 text-sm text-fg-muted">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-fg" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          )}
          {plan.href && (
            <a
              href={plan.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-bold transition hover:bg-fg hover:text-bg"
            >
              خرید {plan.name}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      ))}
      {note && <p className="text-xs text-fg-faint sm:col-span-full">{note}</p>}
    </div>
  );
}
