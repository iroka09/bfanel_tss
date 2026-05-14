import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "unsubscribed",
  "bounced",
  "pending",
]);

export const newsletter = pgTable("newsletter", {
  // IDs
  id: serial("id").primaryKey(),
  subscriberId: text("subscriber_id")
    .notNull()
    .unique()
    .$defaultFn(() => createId()),

  // Required
  email: varchar("email", { length: 255 }).notNull().unique(),

  // Optional profile
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),

  // Status & defaults
  status: subscriptionStatusEnum("status").notNull().default("pending"),
  isConfirmed: boolean("is_confirmed").notNull().default(false), // email confirmation
  isActive: boolean("is_active").notNull().default(true),

  // Preferences
  topics: text("topics").array(),         // e.g. ["products", "offers", "news"]
  frequency: varchar("frequency", { length: 20 }).default("weekly"), // daily, weekly, monthly

  // Tracking
  confirmationToken: text("confirmation_token"), // for email confirmation link
  unsubscribeToken: text("unsubscribe_token")    // for one-click unsubscribe link
    .$defaultFn(() => createId()),
  source: varchar("source", { length: 100 }),    // where they signed up e.g. "homepage", "checkout"
  ipAddress: varchar("ip_address", { length: 45 }), // for spam protection

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),      // null until they confirm email
  unsubscribedAt: timestamp("unsubscribed_at"), // null until they unsubscribe
  lastEmailSentAt: timestamp("last_email_sent_at"),
});

export type NewsletterSubscriber = typeof newsletter.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletter.$inferInsert;