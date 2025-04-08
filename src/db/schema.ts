import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for better type safety
export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "doctor",
  "staff",
  "patient",
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  email_verified: boolean("email_verified").default(false),
  phone: varchar("phone", { length: 20 }),
  phone_verified: boolean("phone_verified").default(false),
  password_hash: text("password").notNull(),
  salt: text("salt").notNull(),
  role: userRoleEnum("role").default("patient").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctor = pgTable("doctor", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  city: text("city"),
  specialization: text("specialization"),
  degree: text("degree"),
  experience: integer("experience"),
  aboutSelf: text("about_self"),
  aboutClinic: text("about_clinic"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  image_link: text("image_link"),
  signature_link: text("signature_link"),
});

// Relations
export const doctorRelations = relations(doctor, ({ one }) => ({
  user: one(users, {
    fields: [doctor.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ one }) => ({
  doctor: one(doctor, {
    fields: [users.id],
    references: [doctor.userId],
  }),
}));

// email_verification_token: text('email_verification_token'),
// email_verification_token_expires: timestamp('email_verification_token_expires'),
// phone_verification_token: text('phone_verification_token'),
// phone_verification_token_expires: timestamp('phone_verification_token_expires'),
