"use client";

import Image from "next/image";
import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { holding } from "@/content/holding";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const KEY = "install-dismissed-at";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

function snoozed(): boolean {
  try {
    const at = Number(localStorage.getItem(KEY) ?? 0);
    return at > 0 && Date.now() - at < SNOOZE_MS;
  } catch {
    return false;
  }
}

/**
 * «Install the app» card for phone visitors on the website.
 * Android/Chromium: uses the native install prompt. iOS Safari: explains Share → Add to Home Screen.
 * Never shows inside the installed app, on desktop widths, or for 14 days after being closed.
 */
export function InstallPrompt() {
  const [mode, setMode] = useState<"none" | "native" | "ios">("none");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (document.documentElement.dataset.app === "1" || snoozed()) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("native");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIos) t = setTimeout(() => setMode("ios"), 1500);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (t) clearTimeout(t);
    };
  }, []);

  if (mode === "none") return null;

  function close() {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setMode("none");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setMode("none");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:hidden app:hidden" role="region" aria-label="نصب اپ">
      <div className="grain relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-bg p-2">
          <Image src={holding.logo.mark} alt="" width={40} height={48} className="h-full w-auto" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">اپ {holding.nameFa}</p>
          {mode === "native" ? (
            <p className="text-xs text-fg-muted">دسترسی سریع‌تر، بدون نوار مرورگر</p>
          ) : (
            <p className="text-xs leading-5 text-fg-muted">
              دکمه‌ی <Share className="inline size-3.5 align-[-2px]" aria-label="اشتراک‌گذاری" /> را بزنید، بعد «Add to Home Screen»
            </p>
          )}
        </div>
        {mode === "native" && (
          <button
            type="button"
            onClick={install}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-2 text-xs font-bold text-white"
          >
            <Download className="size-3.5" aria-hidden />
            نصب
          </button>
        )}
        <button
          type="button"
          onClick={close}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-fg-faint hover:text-fg"
          aria-label="بستن"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
