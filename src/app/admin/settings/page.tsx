import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm, NotifyEmailForm } from "@/components/admin/SettingsForms";
import { getSetting } from "@/lib/auth";
import { mailConfigured } from "@/lib/mail";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const notifyEmail = getSetting("notify_email") ?? "";
  const hasDbPassword = !!getSetting("password_hash");

  return (
    <AdminShell title="تنظیمات" current="/admin/settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-tile border border-line bg-bg-elevated p-6">
          <h2 className="font-bold">رمز عبور ادمین</h2>
          <p className="mt-1 text-xs text-fg-muted">
            کاربر: <span className="ltr-nums font-semibold">{admin.username}</span> ·{" "}
            {hasDbPassword ? "رمز از پنل تنظیم شده است." : "رمز فعلاً از .env خوانده می‌شود."}
          </p>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
        </section>

        <section className="rounded-tile border border-line bg-bg-elevated p-6">
          <h2 className="font-bold">اعلان درخواست جدید</h2>
          <p className="mt-1 text-xs text-fg-muted">با هر درخواست مشاوره، خلاصه‌اش به این ایمیل ارسال می‌شود.</p>
          <div className="mt-5">
            <NotifyEmailForm initial={notifyEmail} smtpReady={mailConfigured()} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
