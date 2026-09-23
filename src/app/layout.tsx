import type { Metadata, Viewport } from "next";
import "./globals.css";
import { holding } from "@/content/holding";
import { ServiceWorker } from "@/components/brand/ServiceWorker";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? `https://${holding.appDomain}`),
  title: {
    default: `${holding.nameFa} — ${holding.slogan}`,
    template: `%s — ${holding.nameFa}`,
  },
  description: `${holding.subtitle} — پورتال یکپارچه‌ی محصولات ${holding.nameFa}`,
  applicationName: holding.nameFa,
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { url: holding.logo.mark, type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: holding.nameFa,
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  appleWebApp: { capable: true, title: holding.nameFa, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: restores the saved theme and detects the installed app (PWA standalone),
// so web/app layout differences are pure CSS with no flash and no hydration mismatch.
// `?app=1` forces app mode for the session (testing on a desktop browser); `?app=0` clears it.
const bootInit = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.dataset.theme=t}}catch(e){}try{var q=new URLSearchParams(location.search).get("app");if(q==="1")sessionStorage.setItem("app","1");if(q==="0")sessionStorage.removeItem("app");var sa=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;if(sa||sessionStorage.getItem("app")==="1"){d.dataset.app="1"}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-IR" dir="rtl" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Vazirmatn-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: bootInit }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
