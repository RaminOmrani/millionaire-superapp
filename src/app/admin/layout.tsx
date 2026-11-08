import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "پنل مدیریت", template: "%s — پنل مدیریت" },
  robots: { index: false, follow: false },
};

/** Admin is a light utility surface regardless of the public theme toggle. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="min-h-dvh bg-bg text-fg">
      {children}
    </div>
  );
}
