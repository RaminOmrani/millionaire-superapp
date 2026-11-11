import { z } from "zod";
import { CONSULT_PRODUCTS, CONSULT_TIMES, CONSULT_STATUSES } from "@/db/schema";
import { CLUB_TEXT_MAX, CLUB_TITLE_MAX, isSafeClubHref } from "./club";
import { toLatinDigits, toPersianDigits } from "./persian-digits";

/** Iranian mobile: 09xxxxxxxxx (accepts Persian digits, spaces, dashes, +98/0098 prefixes). */
export function normalizeIranMobile(input: string): string {
  let s = toLatinDigits(input).replace(/[\s\-()]/g, "");
  if (s.startsWith("+98")) s = "0" + s.slice(3);
  else if (s.startsWith("0098")) s = "0" + s.slice(4);
  else if (s.startsWith("98") && s.length === 12) s = "0" + s.slice(2);
  else if (s.startsWith("9") && s.length === 10) s = "0" + s;
  return s;
}

const trimmed = (max: number) => z.string().trim().max(max);

/** Admin action notes are shown on the public hub cards — keep them short. */
export const ACTION_NOTE_MAX = 160;

export const consultSchema = z.object({
  fullName: trimmed(120).min(2, "نام و نام خانوادگی را کامل بنویسید."),
  phone: z
    .string()
    .transform(normalizeIranMobile)
    .refine((v) => /^09\d{9}$/.test(v), "شماره موبایل باید به شکل ۰۹xxxxxxxxx باشد."),
  businessName: trimmed(120).optional().transform((v) => (v ? v : null)),
  product: z.enum(CONSULT_PRODUCTS, { message: "محصول موردنظر را انتخاب کنید." }),
  message: trimmed(2000).optional().transform((v) => (v ? v : null)),
  bestTime: z
    .union([z.enum(CONSULT_TIMES), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional(),
});

export type ConsultInput = z.input<typeof consultSchema>;
export type ConsultValues = z.output<typeof consultSchema>;

export const statusSchema = z.enum(CONSULT_STATUSES);

export const notesSchema = z.string().trim().max(4000);

export const loginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید."),
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

/* ---------------- customer club (admin settings → landing section) ---------------- */

export const clubSchema = z.object({
  title: z.string().trim().max(CLUB_TITLE_MAX, `عنوان حداکثر ${toPersianDigits(CLUB_TITLE_MAX)} کاراکتر است.`),
  // Empty text is valid: it hides the section on the landing.
  text: z.string().trim().max(CLUB_TEXT_MAX, `متن حداکثر ${toPersianDigits(CLUB_TEXT_MAX)} کاراکتر است.`),
  href: z
    .string()
    .trim()
    .max(500, "لینک خیلی طولانی است.")
    .refine((v) => v === "" || isSafeClubHref(v), "لینک باید آدرس کامل (با https یا http) یا مسیری از همین سایت باشد که با / شروع می‌شود."),
});

export type ClubValues = z.output<typeof clubSchema>;
