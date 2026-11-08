import type { CONSULT_PRODUCTS, CONSULT_STATUSES, CONSULT_TIMES } from "@/db/schema";
import { products } from "./products";

type ConsultProduct = (typeof CONSULT_PRODUCTS)[number];
type ConsultTime = (typeof CONSULT_TIMES)[number];
type ConsultStatus = (typeof CONSULT_STATUSES)[number];

export const PRODUCT_LABELS: Record<ConsultProduct, string> = {
  ...(Object.fromEntries(products.map((p) => [p.slug, p.nameFa])) as Record<
    Exclude<ConsultProduct, "unknown">,
    string
  >),
  unknown: "نمی‌دانم",
};

export const TIME_LABELS: Record<ConsultTime, string> = {
  morning: "صبح",
  noon: "ظهر",
  evening: "عصر",
};

export const STATUS_LABELS: Record<ConsultStatus, string> = {
  new: "جدید",
  contacted: "تماس گرفته شد",
  closed: "بسته",
};
