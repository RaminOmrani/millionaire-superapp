import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";
import { ConsultForm } from "@/components/product/ConsultForm";
import { holding } from "@/content/holding";
import { toPersianDigits } from "@/lib/persian-digits";

export const metadata: Metadata = {
  title: "درخواست مشاوره",
  description: `تماس با ${holding.nameFa}`,
};

export default function ConsultPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="display text-balance text-4xl sm:text-5xl">درخواست مشاوره</h1>
          <p className="mt-4 text-lg text-fg-muted">
            برای انتخاب محصول مناسب کسب‌وکارتان فرم را پر کنید یا مستقیم تماس بگیرید.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-fg-faint" aria-hidden />
              <div>
                <dt className="text-fg-faint">تلفن</dt>
                <dd>
                  <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="ltr-nums text-lg font-bold">
                    {toPersianDigits(holding.phone)}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-fg-faint" aria-hidden />
              <div>
                <dt className="text-fg-faint">ایمیل</dt>
                <dd>
                  <a href={`mailto:${holding.email}`} className="ltr-nums text-lg font-bold">
                    {holding.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 text-fg-faint" aria-hidden />
              <div>
                <dt className="text-fg-faint">ساعت کاری</dt>
                <dd className="font-medium">{holding.workingHours}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="relative lg:col-span-7">
          <ConsultForm />
        </div>
      </div>
    </section>
  );
}
