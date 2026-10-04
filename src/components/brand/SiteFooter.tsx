import Link from "next/link";
import { Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { HoldingLogo } from "@/components/brand/HoldingLogo";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { MapButton } from "@/components/ui/MapButton";
import { holding } from "@/content/holding";
import { toPersianDigits } from "@/lib/persian-digits";

export function SiteFooter() {
  const year = toPersianDigits(new Date().toLocaleDateString("fa-IR-u-nu-latn", { year: "numeric" }));

  return (
    <footer className="relative mt-20 border-t border-line/60 app:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <HoldingLogo className="h-11 w-auto" />
          <p className="display mt-5 text-xl text-balance">{holding.slogan}</p>
          <p className="mt-2 text-sm text-fg-muted">{holding.subtitle}</p>
          <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="پیوندها">
            <Link href="/#products" className="text-fg-muted hover:text-fg">محصولات</Link>
            <Link href="/about" className="text-fg-muted hover:text-fg">درباره ما</Link>
            <Link href="/consult" className="text-fg-muted hover:text-fg">درخواست مشاوره</Link>
          </nav>
        </div>

        <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:col-span-8">
          <Item icon={Phone} label="تلفن">
            <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="ltr-nums font-medium hover:text-fg">
              {toPersianDigits(holding.phone)}
            </a>
          </Item>
          <Item icon={Mail} label="ایمیل">
            <a href={`mailto:${holding.email}`} className="ltr-nums font-medium hover:text-fg">
              {holding.email}
            </a>
          </Item>
          <Item icon={Clock} label="ساعت کاری">
            <span className="font-medium">{holding.workingHours}</span>
          </Item>
          <Item icon={LifeBuoy} label="مرکز پشتیبانی همه‌ی محصولات">
            <a href={holding.supportCenter} target="_blank" rel="noopener noreferrer" className="ltr-nums font-medium underline-offset-4 hover:underline">
              {holding.supportCenter.replace("https://", "")}
            </a>
          </Item>
          <Item icon={MapPin} label="آدرس" className="sm:col-span-2">
            <span className="block leading-7">{holding.address}</span>
            <MapButton size="sm" className="mt-2" />
          </Item>
        </dl>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-fg-faint sm:px-6 lg:px-8">
          <span>
            © {year} {holding.nameFa}
          </span>
          <div className="flex items-center gap-4">
            <a href={holding.website} target="_blank" rel="noopener noreferrer" className="ltr-nums hover:text-fg">
              softmiliac.com
            </a>
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Item({ icon: Icon, label, className, children }: { icon: typeof Phone; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-3 ${className ?? ""}`}>
      <Icon className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
      <div className="min-w-0">
        <dt className="text-fg-faint">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}
