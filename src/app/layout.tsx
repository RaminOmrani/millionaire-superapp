import type { Metadata, Viewport } from "next";
import "./globals.css";
import { holding } from "@/content/holding";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? `https://${holding.appDomain}`),
  title: {
    default: `${holding.nameFa} — ${holding.slogan}`,
    template: `%s — ${holding.nameFa}`,
  },
  description: `${holding.subtitle} — پورتال یکپارچه‌ی محصولات ${holding.nameFa}`,
  applicationName: holding.nameFa,
  icons: { icon: holding.logo.mark },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: restores the saved theme so the page never flashes.
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
