"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { PricingPlan } from "@/db/schema";
import { inputClass } from "@/components/ui/Field";

type Draft = { name: string; price: string; period: string; features: string; href: string; highlight: boolean };

const toDraft = (p: PricingPlan): Draft => ({
  name: p.name,
  price: p.price,
  period: p.period ?? "",
  features: p.features.join("\n"),
  href: p.href ?? "",
  highlight: !!p.highlight,
});

const fromDraft = (d: Draft): PricingPlan => ({
  name: d.name.trim(),
  price: d.price.trim(),
  period: d.period.trim() || undefined,
  features: d.features
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean),
  href: d.href.trim() || undefined,
  highlight: d.highlight || undefined,
});

const empty: Draft = { name: "", price: "", period: "ماهانه", features: "", href: "", highlight: false };

/** Repeating plan rows; serialised into a hidden `plans` JSON field for the Server Action. */
export function PlansEditor({ initial }: { initial: PricingPlan[] }) {
  const [rows, setRows] = useState<Draft[]>(initial.map(toDraft));

  const update = (i: number, patch: Partial<Draft>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const serialised = JSON.stringify(rows.filter((r) => r.name.trim() && r.price.trim()).map(fromDraft));

  return (
    <div className="space-y-4">
      <input type="hidden" name="plans" value={serialised} />
      {rows.length === 0 && (
        <p className="text-sm text-fg-muted">پلنی تعریف نشده؛ «خرید و تعرفه‌ها» طبق data.md نمایش داده می‌شود.</p>
      )}
      {rows.map((row, i) => (
        <fieldset key={i} className="grid gap-3 rounded-2xl border border-line bg-bg p-4 sm:grid-cols-2">
          <legend className="px-2 text-xs font-semibold text-fg-muted">پلن {i + 1}</legend>
          <label className="text-sm">
            نام پلن
            <input className={inputClass} value={row.name} onChange={(e) => update(i, { name: e.target.value })} />
          </label>
          <label className="text-sm">
            قیمت (مثلاً ۱٬۲۰۰٬۰۰۰ تومان)
            <input className={inputClass} value={row.price} onChange={(e) => update(i, { price: e.target.value })} />
          </label>
          <label className="text-sm">
            دوره (ماهانه / سالانه / یک‌بار)
            <input className={inputClass} value={row.period} onChange={(e) => update(i, { period: e.target.value })} />
          </label>
          <label className="text-sm">
            لینک خرید
            <input
              className={`${inputClass} text-left`}
              dir="ltr"
              value={row.href}
              onChange={(e) => update(i, { href: e.target.value })}
              placeholder="https://"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            ویژگی‌ها (هر خط یک مورد)
            <textarea
              className={`${inputClass} resize-y`}
              rows={3}
              value={row.features}
              onChange={(e) => update(i, { features: e.target.value })}
            />
          </label>
          <div className="flex items-center justify-between sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={row.highlight}
                onChange={(e) => update(i, { highlight: e.target.checked })}
                className="size-4 accent-brand-red"
              />
              پلن پیشنهادی (برجسته)
            </label>
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-brand-red hover:bg-brand-red/5"
            >
              <Trash2 className="size-3.5" aria-hidden />
              حذف پلن
            </button>
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, { ...empty }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-bg"
      >
        <Plus className="size-4" aria-hidden />
        افزودن پلن
      </button>
    </div>
  );
}
