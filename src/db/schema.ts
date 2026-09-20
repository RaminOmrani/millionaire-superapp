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
