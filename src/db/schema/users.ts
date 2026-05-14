import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Enum for role
export const userRoleEnum = pgEnum("user_role", ["user", "admin", "moderator"]);

// Enum for gender
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const users = pgTable("users", {
  // IDs
  id: integer().primaryKey().generatedAlwaysAsIdentity(),                          // internal auto-increment
  userId: text("user_id")                                 // public-facing unique ID
    .notNull()
    .unique()
    .$defaultFn(() => createId()),                        // auto-generates cuid e.g "clx3k2j0f0000..."

  // Required (from Google)
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  picture: text().notNull(),

  // Optional profile fields
  username: varchar("username", { length: 50 }).unique(), // user can set later
  bio: text(),                                       // profile description
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 100 }),         // city/country
  website: text(),                               // personal website URL
  gender: genderEnum(),                           // uses enum
  dateOfBirth: text("date_of_birth"),                     // "YYYY-MM-DD" string

  // Optional social links
  twitterHandle: varchar("twitter_handle", { length: 50 }),
  githubHandle: varchar("github_handle", { length: 50 }),
  linkedinHandle: varchar("linkedin_handle", { length: 50 }),

  // Fields with default values
  role: userRoleEnum("role").notNull().default("user"),   // everyone starts as user
  isVerified: boolean("is_verified").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  isBanned: boolean("is_banned").notNull().default(false),
  loginCount: integer("login_count").notNull().default(0), // increments on each login
  followersCount: integer("followers_count").notNull().default(0),
  followingCount: integer("following_count").notNull().default(0),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at").notNull().defaultNow(),
  bannedAt: timestamp("banned_at"),                        // null until banned
  deletedAt: timestamp("deleted_at"),                      // null until soft-deleted
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;