"use client";

import { ArrowUpLeft, Bot, CircleHelp, ExternalLink, Info, LifeBuoy, Lock, LogIn, Tag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ActionKey } from "@/content/products";
import type { ResolvedAction } from "@/content/resolve";
import { cn } from "@/lib/utils";

const ICONS: Record<ActionKey, typeof LogIn> = {
  panel: LogIn,
  support: LifeBuoy,
  pricing: Tag,
  details: Info,
  ai: Bot,
};

const COMING_SOON = "به‌زودی";

interface Props {
  action: ResolvedAction;
  index: number;
  className?: string;
  /** Rendered inside the card body (details / pricing content) */
  children?: React.ReactNode;
}

export function ActionCard({ action, index, className, children }: Props) {
  const reduce = useReducedMotion();
  const Icon = ICONS[action.key] ?? CircleHelp;
  const locked = !action.enabled;
  const external = action.enabled && !!action.href && !action.plans?.length;

  const entrance = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.05 + index * 0.07, ease: [0.16, 1, 0.3, 1] as const },
      };

  const anchor = { id: action.key, className: "scroll-mt-28" };
  const shell = cn(
    anchor.className,
    "grain group relative isolate flex min-h-44 flex-col overflow-hidden rounded-tile border bg-surface p-6",
    "border-[color-mix(in_oklab,var(--accent)_28%,transparent)]",
    "transition-[border-color,box-shadow,transform] duration-500",
    locked
      ? "cursor-not-allowed opacity-55 saturate-50"
      : external &&
          "hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_65%,transparent)] hover:shadow-[0_30px_70px_-30px_color-mix(in_oklab,var(--accent)_80%,transparent)]",
    className,
  );

  const body = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(90% 70% at 100% 0%, color-mix(in oklab, var(--accent) calc(var(--tile-glow) * 60%), transparent) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-fg light:border-line light:bg-bg/70">
          <Icon className="size-5" aria-hidden />
        </span>
        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/40 px-3 py-1 text-xs font-semibold text-fg-muted">
            <Lock className="size-3" aria-hidden />
            {COMING_SOON}
          </span>
        ) : external ? (
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fg transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 light:border-line light:bg-bg/70">
            <ArrowUpLeft className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="relative z-10 mt-6 flex-1">
        <h3 className="display text-xl sm:text-2xl">{action.label}</h3>
        {locked && action.teaser && <p className="mt-2 text-sm leading-7 text-fg-muted">{action.teaser}</p>}
        {external && (
          <p className="ltr-nums mt-1 inline-flex items-center gap-1 text-xs text-fg-faint">
            <ExternalLink className="size-3" aria-hidden />
            {action.href?.replace(/^https?:\/\//, "")}
          </p>
        )}
        {children}
      </div>
    </>
  );

  if (locked) {
    return (
      <motion.div {...entrance} id={anchor.id} className={shell} aria-disabled="true" title={COMING_SOON} tabIndex={0}>
        {body}
      </motion.div>
    );
  }

  if (external) {
    return (
      <motion.a
        {...entrance}
        id={anchor.id}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={shell}
        aria-label={`${action.label} (باز شدن در تب جدید)`}
      >
        {body}
      </motion.a>
    );
  }

  return (
    <motion.section {...entrance} id={anchor.id} className={shell} aria-label={action.label}>
      {body}
    </motion.section>
  );
}
