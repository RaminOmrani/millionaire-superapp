"use client";

import { useEffect } from "react";
import { recordRecent } from "@/lib/local-store";

/** Remembers the product hub the visitor opened (this device only) for «اخیراً بازدیدشده». */
export function RecordVisit({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug);
  }, [slug]);
  return null;
}
