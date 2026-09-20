import type { CONSULT_STATUSES } from "@/db/schema";
import { STATUS_LABELS } from "@/content/labels";
import { cn } from "@/lib/utils";

type Status = (typeof CONSULT_STATUSES)[number];

const STYLES: Record<Status, string> = {
  new: "bg-brand-red/10 text-brand-red border-brand-red/30",
  contacted: "bg-[#0048a8]/10 text-[#0048a8] border-[#0048a8]/30",
  closed: "bg-fg/5 text-fg-muted border-line",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
