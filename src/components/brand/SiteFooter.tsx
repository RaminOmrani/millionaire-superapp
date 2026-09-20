import Image from "next/image";
import { Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { holding } from "@/content/holding";
import { toPersianDigits } from "@/lib/persian-digits";

export function SiteFooter() {
  const year = toPersianDigits(new Date().toLocaleDateString("fa-IR-u-nu-latn", { year: "numeric" }));

  return (
    <footer className="relative mt-24 border-t border-line/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <Image
            src={holding.logo.horizontal}
            alt={holding.subtitle}
            width={1080}
            height={371}
            className="h-12 w-auto"
          />
          <p className="display mt-6 max-w-sm text-2xl text-balance">{holding.slogan}</p>
          <p className="mt-3 text-sm text-fg-muted">{holding.subtitle}</p>
        </div>

        <dl className="grid gap-5 text-sm lg:col-span-7 lg:grid-cols-2">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
            <div>
              <dt className="text-fg-faint">تلفن</dt>
              <dd>
                <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="ltr-nums font-medium hover:text-fg">
                  {toPersianDigits(holding.phone)}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
            <div>
              <dt className="text-fg-faint">ایمیل</dt>
              <dd>
                <a href={`mailto:${holding.email}`} className="ltr-nums font-medium hover:text-fg">
                  {holding.email}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
            <div>
              <dt className="text-fg-faint">ساعت کاری</dt>
              <dd className="font-medium">{holding.workingHours}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
            <div>
              <dt className="text-fg-faint">شهر</dt>
              <dd className="font-medium">{holding.city}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 lg:col-span-2">
            <LifeBuoy className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden />
            <div>
              <dt className="text-fg-faint">مرکز پشتیبانی همه‌ی محصولات</dt>
              <dd>
                <a
                  href={holding.supportCenter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ltr-nums font-medium underline-offset-4 hover:underline"
                >
                  {holding.supportCenter.replace("https://", "")}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-fg-faint sm:px-6 lg:px-8">
          <span>
            © {year} {holding.nameFa}
          </span>
          <a href={holding.website} target="_blank" rel="noopener noreferrer" className="ltr-nums hover:text-fg">
            softmiliac.com
          </a>
        </div>
      </div>
    </footer>
  );
}
