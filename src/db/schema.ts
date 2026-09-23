import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Consultation form (data.md §4) — product select includes «نمی‌دانم». */
export const CONSULT_PRODUCTS = [
  "millionaire",
  "crm",
  "shopmojahaz",
  "menuclub",
  "garson",
  "unknown",
] as const;

export const CONSULT_TIMES = ["morning", "noon", "evening"] as const;

export const CONSULT_STATUSES = ["new", "contacted", "closed"] as const;

export const consultRequests = sqliteTable("consult_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  businessName: text("business_name"),
  product: text("product", { enum: CONSULT_PRODUCTS }).notNull(),
  message: text("message"),
  bestTime: text("best_time", { enum: CONSULT_TIMES }),
  status: text("status", { enum: CONSULT_STATUSES }).notNull().default("new"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type ConsultRequest = typeof consultRequests.$inferSelect;
export type NewConsultRequest = typeof consultRequests.$inferInsert;

/* ------------------------------------------------------------------ */
/* Content overrides — edited from /admin, layered over products.ts    */
/* ------------------------------------------------------------------ */

export const PRODUCT_STATUSES = ["active", "coming_soon"] as const;

export interface ActionOverride {
  enabled?: boolean;
  href?: string | null;
  note?: string | null;
  content?: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  href?: string;
  highlight?: boolean;
}

export const productContent = sqliteTable("product_content", {
  slug: text("slug").primaryKey(),
  status: text("status", { enum: PRODUCT_STATUSES }),
  description: text("description"),
  website: text("website"),
  version: text("version"),
  features: text("features", { mode: "json" }).$type<string[]>(),
  actions: text("actions", { mode: "json" }).$type<Record<string, ActionOverride>>(),
  plans: text("plans", { mode: "json" }).$type<PricingPlan[]>(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type ProductContentRow = typeof productContent.$inferSelect;

/** Key/value settings (admin password hash, notification e-mail, …). */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Login audit + brute-force throttling. */
export const loginAttempts = sqliteTable("login_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  username: text("username").notNull(),
  success: integer("success", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/* ------------------------------------------------------------------ */
/* Promo banners — managed from /admin/banners                          */
/* ------------------------------------------------------------------ */

export const BANNER_PLACEMENTS = ["top", "middle"] as const;
export const BANNER_AUDIENCES = ["both", "web", "app"] as const;

export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  subtitle: text("subtitle"),
  ctaLabel: text("cta_label"),
  href: text("href"),
  /** "brand" or a product slug — drives the accent colours and the mark shown */
  theme: text("theme").notNull().default("brand"),
  /** File name under DATA_DIR/uploads/banners, served from /media/banners/<file> */
  image: text("image"),
  placement: text("placement", { enum: BANNER_PLACEMENTS }).notNull().default("top"),
  audience: text("audience", { enum: BANNER_AUDIENCES }).notNull().default("both"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sort: integer("sort").notNull().default(0),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Banner = typeof banners.$inferSelect;
