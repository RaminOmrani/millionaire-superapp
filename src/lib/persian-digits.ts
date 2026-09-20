const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Convert every ASCII (and Arabic-Indic) digit in the input to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    const n = code >= 0x0660 ? code - 0x0660 : code - 48;
    return PERSIAN_DIGITS[n] ?? d;
  });
}

/** Convert Persian/Arabic-Indic digits back to ASCII (for validation of user input). */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    const n = code >= 0x06f0 ? code - 0x06f0 : code - 0x0660;
    return String(n);
  });
}
