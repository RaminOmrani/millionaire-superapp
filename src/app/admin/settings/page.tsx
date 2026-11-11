import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm, ClubForm, NotifyEmailForm } from "@/components/admin/SettingsForms";
import { getClubSettings } from "@/content/club";
import { getSetting } from "@/lib/auth";
import { mailConfigured } from "@/lib/mail";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const notifyEmail = getSetting("notify_email") ?? "";
  const hasDbPassword = !!getSetting("password_hash");
  const club = getClubSettings();

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

        <section className="rounded-tile border border-line bg-bg-elevated p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold">باشگاه مشتریان</h2>
            <span
              className={
                club.text
                  ? "rounded-full bg-[#0048a8]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0048a8]"
                  : "rounded-full bg-fg/5 px-2.5 py-0.5 text-xs font-semibold text-fg-muted"
              }
            >
              {club.text ? "در صفحه‌ی اول نمایش داده می‌شود" : "پنهان"}
            </span>
          </div>
          <p className="mt-1 text-xs text-fg-muted">
            بخش کوتاه «باشگاه مشتریان» در صفحه‌ی اول، زیر محصولات و خدمات (در اپ نصب‌شده، زیر بنرها).
          </p>
          <div className="mt-5 max-w-2xl">
            <ClubForm initial={club} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
