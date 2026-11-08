"use client";

import Image from "next/image";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

/** Client-safe twin of HoldingLogo (for client components such as the side menu). */
export function HoldingLogoClient({ className }: { className?: string }) {
  return (
    <>
      <Image src={holding.logo.horizontalDark} alt={holding.subtitle} width={1080} height={371} className={cn(className, "light:hidden")} />
      <Image src={holding.logo.horizontal} alt={holding.subtitle} width={1080} height={371} className={cn(className, "hidden light:block")} />
    </>
  );
}
