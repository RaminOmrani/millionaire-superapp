import { and, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";

export const dynamic = "force-dynamic";

/**
 * Public «تازه‌ها» feed for the side menu: live admin banners that have a title
 * (house banners are not news). Newest first.
 */
export async function GET() {
  const now = Date.now();
  const rows = getDb()
    .select()
    .from(schema.banners)
    .where(and(eq(schema.banners.active, true)))
    .orderBy(desc(schema.banners.createdAt))
    .limit(20)
    .all()
    .filter((b) => b.title && (!b.startsAt || b.startsAt.getTime() <= now) && (!b.endsAt || b.endsAt.getTime() >= now))
    .slice(0, 6)
    .map((b) => ({
      id: b.id,
      title: b.title!,
      subtitle: b.subtitle,
      href: b.href,
      external: !!b.href && /^https?:\/\//.test(b.href),
      audience: b.audience,
      at: b.createdAt.getTime(),
    }));
  return Response.json({ items: rows }, { headers: { "Cache-Control": "no-store" } });
}
