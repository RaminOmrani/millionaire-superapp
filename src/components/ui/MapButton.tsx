import { ExternalLink, Navigation } from "lucide-react";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

/** One consistent «route with Neshan» button for about/consult/footer. */
export function MapButton({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <a
      href={holding.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface font-bold text-fg transition hover:border-fg/30 active:scale-[0.98]",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        className,
      )}
    >
      <Navigation className={size === "sm" ? "size-3.5" : "size-4"} aria-hidden />
      مسیریابی با نشان
      <ExternalLink className="size-3 text-fg-faint" aria-hidden />
    </a>
  );
}
