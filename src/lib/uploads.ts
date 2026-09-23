import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/** Uploads live next to the SQLite file so they share the Docker volume and the backups' host. */
export function uploadsDir(kind: "banners"): string {
  const dbPath = process.env.DATABASE_PATH ?? "./data/app.db";
  return path.resolve(path.dirname(dbPath), "uploads", kind);
}

/** Raster only — SVG is refused on purpose (it can carry script). */
export const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

/** Magic-byte sniffing so a renamed file cannot pass as an image. */
function sniff(buf: Buffer): string | null {
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (buf.subarray(4, 12).toString("ascii").startsWith("ftypavi")) return "image/avif";
  return null;
}

export async function saveUpload(kind: "banners", file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("حجم تصویر باید حداکثر ۱٫۵ مگابایت باشد.");
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type || !IMAGE_TYPES[type]) throw new Error("فقط تصویر PNG، JPG، WebP یا AVIF پذیرفته می‌شود.");
  const dir = uploadsDir(kind);
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${IMAGE_TYPES[type]}`;
  await fs.writeFile(path.join(dir, name), buf);
  return name;
}

export async function deleteUpload(kind: "banners", name: string | null | undefined): Promise<void> {
  if (!name || !/^[a-z0-9-]+\.(png|jpg|webp|avif)$/.test(name)) return;
  await fs.rm(path.join(uploadsDir(kind), name), { force: true });
}
