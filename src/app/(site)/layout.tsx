import { AppTabBar } from "@/components/brand/AppTabBar";
import { InstallPrompt } from "@/components/brand/InstallPrompt";
import { MobileCtaBar } from "@/components/brand/MobileCtaBar";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col pb-20 sm:pb-0 app:pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <SiteHeader />
      <InstallPrompt />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileCtaBar />
      <AppTabBar />
    </div>
  );
}
