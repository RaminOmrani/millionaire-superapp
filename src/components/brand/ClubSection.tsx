import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import type { ClubView } from "@/content/club";
import { holding } from "@/content/holding";

const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-base font-bold text-bg transition hover:opacity-90 active:scale-[0.98]";

/**
 * Landing «باشگاه مشتریان» band. Every word on it comes from /admin/settings (data.md has no club content);
 * the membership card on the side is pure decoration built from the holding's own mark and name.
 */
export function ClubSection({ club }: { club: ClubView }) {
  return (
    <section aria-labelledby="club-title" className="mx-auto mt-14 max-w-6xl px-4 sm:mt-20 sm:px-6 lg:px-8 app:mt-10">
      <div className="grain relative overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 120% at 0% 50%, color-mix(in oklab, var(--color-brand-red) 34%, transparent), transparent 70%)," +
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-brand-red-deep) 12%, transparent))",
          }}
        />
        {/* Hairline rule on the reading edge — an editorial accent rather than another bordered card. */}
        <span aria-hidden className="absolute inset-y-8 right-0 w-1 rounded-l-full bg-brand-red sm:inset-y-10" />

        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12 app:p-5">
          <div className="min-w-0 lg:col-span-7">
            <h2 id="club-title" className="display text-balance break-words text-3xl leading-[1.2] sm:text-4xl lg:text-5xl app:text-2xl">
              {club.title}
            </h2>
            <p className="mt-4 max-w-xl whitespace-pre-line text-pretty [overflow-wrap:anywhere] text-base leading-8 text-fg-muted sm:text-lg sm:leading-9 app:text-[15px] app:leading-8">
              {club.text}
            </p>
            {club.href &&
              (club.external ? (
                <a href={club.href} target="_blank" rel="noopener noreferrer" className={`mt-7 ${ctaClass}`}>
                  اطلاعات بیشتر
                  <ArrowUpLeft className="size-4" aria-hidden />
                  <span className="sr-only">(در پنجره‌ی جدید)</span>
                </a>
              ) : (
                <Link href={club.href} className={`mt-7 ${ctaClass}`}>
                  اطلاعات بیشتر
                  <ArrowLeft className="size-4" aria-hidden />
                </Link>
              ))}
          </div>

          <div aria-hidden className="hidden sm:block lg:col-span-5">
            <MemberCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Decorative membership card: dark lacquer, red glow, the holding mark and its Latin name. Stays dark in light mode. */
function MemberCard() {
  return (
    <div className="mx-auto w-full max-w-[340px] lg:mr-auto lg:ml-0">
      <div className="grain relative aspect-[1.586] -rotate-3 overflow-hidden rounded-[1.4rem] border border-white/10 bg-brand-dark shadow-[0_30px_60px_-25px_rgb(0_0_0/0.65)] transition-transform duration-700 ease-out-expo hover:rotate-0 motion-reduce:transition-none">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(90% 120% at 100% 0%, color-mix(in oklab, var(--color-brand-red) 70%, transparent), transparent 60%)," +
              "radial-gradient(70% 90% at 0% 100%, color-mix(in oklab, var(--color-brand-red-deep) 80%, transparent), transparent 70%)",
          }}
        />
        {/* Sheen */}
        <div className="absolute -inset-x-10 -top-1/2 h-full -rotate-12 bg-gradient-to-b from-white/12 to-transparent" />
        <div className="relative z-[2] flex h-full flex-col justify-between p-5 text-[#f7f5f2]">
          <div className="flex items-start justify-between">
            <span className="block h-7 w-10 rounded-md border border-white/25 bg-gradient-to-br from-[#f8b878]/80 to-[#f8b878]/30" />
            <Image src="/brand/millionaire/mark.svg" alt="" width={34} height={40} className="h-10 w-auto" />
          </div>
          <div className="space-y-2" dir="ltr">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-1.5 w-8 rounded-full bg-white/25" />
              ))}
            </div>
            <p className="text-left text-xs font-semibold tracking-[0.25em] text-white/80 uppercase">{holding.nameEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
