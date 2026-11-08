import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { holding } from "@/content/holding";
import { toPersianDigits } from "@/lib/persian-digits";

export const metadata: Metadata = { title: "آفلاین", robots: { index: false } };

/** Served by the service worker when a navigation fails (no network). Must stay static. */
export default function OfflinePage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <WifiOff className="size-10 text-fg-faint" aria-hidden />
      <h1 className="display mt-5 text-3xl">اتصال اینترنت برقرار نیست</h1>
      <p className="mt-3 text-fg-muted">پس از اتصال، صفحه را دوباره باز کنید.</p>
      <p className="mt-8 text-sm text-fg-muted">
        تماس:{" "}
        <a href={`tel:${holding.phone.replace(/-/g, "")}`} className="ltr-nums font-bold text-fg">
          {toPersianDigits(holding.phone)}
        </a>
      </p>
    </section>
  );
}
