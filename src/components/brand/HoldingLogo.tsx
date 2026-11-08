import Image from "next/image";
import { holding } from "@/content/holding";
import { cn } from "@/lib/utils";

/** Holding logo with the light-wordmark variant on dark surfaces. */
export function HoldingLogo({ variant = "horizontal", className, priority }: { variant?: "horizontal" | "vertical"; className?: string; priority?: boolean }) {
  const [light, dark, w, h] =
    variant === "horizontal"
      ? [holding.logo.horizontal, holding.logo.horizontalDark, 1080, 371]
      : [holding.logo.vertical, holding.logo.verticalDark, 967, 1080];
  return (
    <>
      <Image src={dark} alt={holding.subtitle} width={w} height={h} priority={priority} className={cn(className, "light:hidden")} />
      <Image src={light} alt={holding.subtitle} width={w} height={h} priority={priority} className={cn(className, "hidden light:block")} />
    </>
  );
}
