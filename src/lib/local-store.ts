"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed stores read through useSyncExternalStore (no setState-in-effect,
 * no hydration mismatch: the server snapshot is always empty).
 */
const EVENT = "local-store";

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useLocal(key: string): string {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => "",
  );
}

/* ---------------- recently viewed products ---------------- */

const RECENT_KEY = "recent-products";
const RECENT_MAX = 4;

export function recordRecent(slug: string) {
  const list = read(RECENT_KEY).split(",").filter(Boolean).filter((s) => s !== slug);
  writeLocal(RECENT_KEY, [slug, ...list].slice(0, RECENT_MAX).join(","));
}

export function useRecent(): string[] {
  const raw = useLocal(RECENT_KEY);
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function clearRecent() {
  writeLocal(RECENT_KEY, "");
}

/* ---------------- news seen marker ---------------- */

const NEWS_KEY = "news-seen-at";

export function useNewsSeenAt(): number {
  return Number(useLocal(NEWS_KEY) || 0);
}

export function markNewsSeen(at: number) {
  writeLocal(NEWS_KEY, String(at));
}
