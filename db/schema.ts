import { pgEnum, unique, uniqueIndex } from "drizzle-orm/pg-core";
import {
  pgTable,
  text,
  boolean,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified_at", { withTimezone: true }),
  password: text("password").notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  isTwoFactorEnabled: boolean("has_two_factor_enabled").default(false),
  deletedAt: text("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationToken = pgTable(
  "verification-token",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (tokens) => ({
    emailTokenUnique: uniqueIndex("email_token_unique").on(
      tokens.email,
      tokens.token
    ),
  })
);

export const passwordResetToken = pgTable(
  "password_resets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (tokens) => ({
    emailTokenUnique: uniqueIndex("password_reset_email_token_unique").on(
      tokens.email,
      tokens.token
    ),
  })
);

export const twoFactorToken = pgTable(
  "two-factor-token",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (tokens) => ({
    emailTokenUnique: uniqueIndex("two_factor_tokens_unique").on(
      tokens.email,
      tokens.token
    ),
  })
);

export const twoFactorConfirmation = pgTable(
  "two_factor_confirmations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userId: unique().on(table.userId),
    };
  }
);
