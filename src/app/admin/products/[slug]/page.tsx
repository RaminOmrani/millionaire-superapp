import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import { resetProductContent } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { ProductContentForm } from "@/components/admin/ProductContentForm";
import { getProduct, isProductSlug } from "@/content/products";
import { getProductContentRow } from "@/content/resolve";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isProductSlug(slug)) notFound();
  const base = getProduct(slug);
  if (!base) notFound();
  const row = getProductContentRow(slug);
  const reset = resetProductContent.bind(null, slug);

  return (
    <AdminShell
      title={base.nameFa}
      current="/admin/products"
      actions={
        <form action={reset}>
          <ConfirmSubmit
            message="همه‌ی تغییرات این محصول حذف و مقادیر data.md برگردانده شود؟"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-brand-red hover:bg-brand-red/5"
          >
            <RotateCcw className="size-4" aria-hidden />
            بازگشت به پیش‌فرض
          </ConfirmSubmit>
        </form>
      }
    >
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
        <ArrowRight className="size-4" aria-hidden />
        همه‌ی محصولات
      </Link>
      <ProductContentForm base={base} row={row} />
    </AdminShell>
  );
}
