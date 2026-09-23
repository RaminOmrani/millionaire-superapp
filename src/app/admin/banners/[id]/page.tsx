import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowRight, Trash2 } from "lucide-react";
import { deleteBanner } from "@/app/admin/banner-actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { BannerForm } from "@/components/admin/BannerForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { getDb, schema } from "@/db/client";
import { requireAdmin } from "@/lib/session";
import { bannerThemesWithMarks } from "../themes";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const banner = getDb().select().from(schema.banners).where(eq(schema.banners.id, id)).get();
  if (!banner) notFound();
  const remove = deleteBanner.bind(null, id);

  return (
    <AdminShell
      title="ویرایش بنر"
      current="/admin/banners"
      actions={
        <form action={remove}>
          <ConfirmSubmit
            message="این بنر حذف شود؟"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-brand-red hover:bg-brand-red/5"
          >
            <Trash2 className="size-4" aria-hidden />
            حذف بنر
          </ConfirmSubmit>
        </form>
      }
    >
      <Link href="/admin/banners" className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
        <ArrowRight className="size-4" aria-hidden />
        همه‌ی بنرها
      </Link>
      <BannerForm banner={banner} themes={bannerThemesWithMarks()} />
    </AdminShell>
  );
}
