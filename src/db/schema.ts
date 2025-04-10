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
import { uniqueIndex } from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

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
  phone: varchar("phone", { length: 20 }),
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

  facebook_link: text("facebook_link"),
  instagram_link: text("instagram_link"),
  twitter_link: text("twitter_link"),
  linkedin_link: text("linkedin_link"),
  seo_description: text("seo_description"),
});

export const doctorEducation = pgTable("doctor_education", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .references(() => doctor.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }), // optional
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"),
  details: text("details"),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorExperience = pgTable("doctor_experience", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .references(() => doctor.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }), // optional
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"), // nullable for current roles
  details: text("details"),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorMetaTags = pgTable(
  "doctor_meta_tags",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id")
      .notNull()
      .references(() => doctor.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => ({
    uniqueDoctorTag: uniqueIndex("unique_doctor_tag").on(
      table.doctorId,
      table.tag
    ),
  })
);

// Relations
export const doctorRelations = relations(doctor, ({ one, many }) => ({
  user: one(users, {
    fields: [doctor.userId],
    references: [users.id],
  }),
  metaTags: many(doctorMetaTags),
  educations: many(doctorEducation),
  experiences: many(doctorExperience),
}));

export const doctorMetaTagRelations = relations(doctorMetaTags, ({ one }) => ({
  doctor: one(doctor, {
    fields: [doctorMetaTags.doctorId],
    references: [doctor.id],
  }),
}));

export const userRelations = relations(users, ({ one }) => ({
  doctor: one(doctor, {
    fields: [users.id],
    references: [doctor.userId],
  }),
}));

export const doctorEducationRelations = relations(
  doctorEducation,
  ({ one }) => ({
    doctor: one(doctor, {
      fields: [doctorEducation.doctorId],
      references: [doctor.id],
    }),
  })
);

export const doctorExperienceRelations = relations(
  doctorExperience,
  ({ one }) => ({
    doctor: one(doctor, {
      fields: [doctorExperience.doctorId],
      references: [doctor.id],
    }),
  })
);

export type User = InferSelectModel<typeof users>;
export type Doctor = InferSelectModel<typeof doctor>;
export type DoctorMetaTag = InferSelectModel<typeof doctorMetaTags>;
export type DoctorEducation = InferSelectModel<typeof doctorEducation>;
export type DoctorExperience = InferSelectModel<typeof doctorExperience>;

export type NewUser = InferInsertModel<typeof users>;
export type NewDoctor = InferInsertModel<typeof doctor>;
export type NewDoctorEducation = InferInsertModel<typeof doctorEducation>;
export type NewDoctorMetaTag = InferInsertModel<typeof doctorMetaTags>;
export type NewDoctorExperience = InferInsertModel<typeof doctorExperience>;
