import { toPersianDigits } from "./persian-digits";

const dateTimeFa = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

const dateFa = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeZone: "Asia/Tehran" });

export function formatDateTimeFa(d: Date): string {
  return dateTimeFa.format(d);
}

export function formatDateFa(d: Date): string {
  return dateFa.format(d);
}

/** 09151234567 → ۰۹۱۵ ۱۲۳ ۴۵۶۷ */
export function formatMobileFa(phone: string): string {
  const m = phone.match(/^(\d{4})(\d{3})(\d{4})$/);
  return toPersianDigits(m ? `${m[1]} ${m[2]} ${m[3]}` : phone);
}

/** Current Solar Hijri year as a number (e.g. 1405). */
export function currentJalaliYear(): number {
  const y = new Intl.DateTimeFormat("fa-IR-u-nu-latn-ca-persian", { year: "numeric", timeZone: "Asia/Tehran" }).format(new Date());
  return Number(y.replace(/\D/g, ""));
}
