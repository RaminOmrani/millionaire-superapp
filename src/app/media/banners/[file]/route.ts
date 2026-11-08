import fs from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/uploads";

const TYPES: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", avif: "image/avif" };

/** Serves uploaded banner images from the data volume. File names are random and immutable. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = /^[a-z0-9-]+\.(png|jpg|webp|avif)$/.exec(file);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(uploadsDir("banners"), file));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[m[1]!]!,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
