import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BannerForm } from "@/components/admin/BannerForm";
import { requireAdmin } from "@/lib/session";
import { bannerThemesWithMarks } from "../themes";

export const dynamic = "force-dynamic";

export default async function NewBannerPage() {
  await requireAdmin();
  return (
    <AdminShell title="بنر جدید" current="/admin/banners">
      <Link href="/admin/banners" className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
        <ArrowRight className="size-4" aria-hidden />
        همه‌ی بنرها
      </Link>
      <BannerForm themes={bannerThemesWithMarks()} />
    </AdminShell>
  );
}
