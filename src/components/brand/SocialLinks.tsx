import { Clapperboard } from "lucide-react";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

/** Simple outline glyph (lucide v1 dropped brand icons). */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

const LINKS = [
  { key: "instagram", label: "اینستاگرام", href: holding.social.instagram, Icon: InstagramGlyph },
  { key: "aparat", label: "آپارات", href: holding.social.aparat, Icon: Clapperboard },
] as const;

export function SocialLinks({ className, withLabels = false }: { className?: string; withLabels?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="شبکه‌های اجتماعی">
      {LINKS.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 text-sm font-medium text-fg-muted transition hover:border-fg/30 hover:text-fg",
              withLabels ? "px-4 py-2" : "size-10 justify-center",
            )}
          >
            <Icon className="size-[18px]" />
            {withLabels && label}
          </a>
        </li>
      ))}
    </ul>
  );
}
