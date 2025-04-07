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
export const userRoleEnum = pgEnum('user_role', ['superadmin', 'admin', 'doctor', 'staff', 'user']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  mobile: varchar('mobile', { length: 20 }),
  password_hash: text('password').notNull(), // Store the hashed password
  salt: text('salt').notNull(),         // Add a salt column
  role: userRoleEnum('role').default('user').notNull(), // Default role is 'user'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
