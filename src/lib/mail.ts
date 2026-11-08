import "server-only";
import nodemailer from "nodemailer";

/** SMTP is optional: when SMTP_HOST is unset, sending is a no-op. */
export function mailConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  if (!mailConfigured()) return;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" } : undefined,
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}
