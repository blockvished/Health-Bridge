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
import { time } from "drizzle-orm/pg-core";
import { date } from "drizzle-orm/pg-core";

// Enums for better type safety
export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "doctor",
  "staff",
  "patient",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const dayEnum = pgEnum("day_of_week", [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export type Gender = (typeof genderEnum.enumValues)[number];

export const appointmentModeEnum = pgEnum("appointment_mode", [
  "online",
  "offline",
]);

export const consultationPlatform = pgEnum("consultation_platform", [
  "google",
  "zoom",
  "teams",
]);

export const TimeFrequencyType = pgEnum("time_frequency_type", ["days", "weeks", "months",]);

export const MealTimeType = pgEnum("meal_time", ["after_meal", "before_meal", "after/before_meal"]);

export const DosageType = pgEnum("dosage_type", [
  "0", "1", "2", "3", "4", "5", "1/2",
  "0.5 ml", "1 ml", "2 ml", "3 ml", "4 ml", "5 ml"
]);

export const DrugType = pgEnum("drug_type",["cap", "tab", "syp", "oin"])

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

export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),

  abhaId: text("abha_id"),
  age: integer("age"),
  weight: integer("weight"),
  height: integer("height"),
  address: text("address"),
  gender: genderEnum("gender"), // assuming genderEnum is already defined
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prescription = pgTable("prescription", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
      .notNull()
      .references(() => patient.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id")
      .notNull()
      .references(() => doctor.id, { onDelete: "cascade" }),
  advice: text("advice"),
  diagnosisTests: text("diagnosis_tests"),
  nextFollowUp: integer("next_follow_up"),
  nextFollowUpType: TimeFrequencyType("next_follow_up_type"), // Use the enum here
  prescriptionNotes: text("prescription_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medication = pgTable("medication", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id")
      .notNull()
      .references(() => prescription.id, { onDelete: "cascade" }),
  drugType: DrugType("drug_type"),
  drugName: varchar("drug_name", { length: 255 }).notNull(),
  morning: DosageType("morning"),  // Use the DosageType enum
  afternoon: DosageType("afternoon"), // Use the DosageType enum
  evening: DosageType("evening"),   // Use the DosageType enum
  night: DosageType("night"),     // Use the DosageType enum
  whenToTake: MealTimeType("when_to_take"),
  note: text("note"),
  howManyDaysToTakeMedication: integer("how_many_days_to_take_medication"),
  medicationFrequecyType: TimeFrequencyType("medication_frequecy_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorBankDetail = pgTable("doctor_bank_detail", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .unique() // Ensures 1-1 relationship
    .references(() => doctor.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  accountHolderName: varchar("account_holder_name", { length: 255 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  ifscCode: varchar("ifsc_code", { length: 20 }).notNull(),
  upiId: varchar("upi_id", { length: 100 }),
});

export const doctorDepartment = pgTable("doctor_department", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  timeFrom: time("time_from").notNull(),
  timeTo: time("time_to").notNull(),
  mode: appointmentModeEnum("mode").notNull(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  paymentStatus: boolean("payment_status").default(false).notNull(),
  visitStatus: boolean("visit_status").default(false).notNull(),
  reason: text("reason"),
  isCancelled: boolean("is_cancelled").default(false).notNull(),
  cancelReason: text("cancel_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patient, {
    fields: [appointments.patientId],
    references: [patient.id],
  }),
  doctor: one(doctor, {
    fields: [appointments.doctorId],
    references: [doctor.id],
  }),
}));

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

export const doctorConsultation = pgTable("doctor_consultation", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" })
    .unique(),
  consultationFees: integer("consultation_fees"),
  mode: consultationPlatform("mode").notNull(),
  consultationLink: text("consultation_link"),
  isLiveConsultationEnabled: boolean("is_live_consultation_enabled").default(
    false
  ), // Added boolean field with a default value
});

export const appointmentSettings = pgTable("appointment_settings", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  intervalMinutes: integer("interval_minutes").notNull(), // e.g., 10, 15, etc.
});

export const appointmentDays = pgTable("appointment_days", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  dayOfWeek: dayEnum("day_of_week").notNull(),

  isActive: boolean("is_active").default(false),
});

export const appointmentTimeRanges = pgTable("appointment_time_ranges", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id")
    .notNull()
    .references(() => appointmentDays.id, { onDelete: "cascade" }),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

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
export type Appointment = InferSelectModel<typeof appointments>;

export type NewAppointment = InferInsertModel<typeof appointments>;
export type NewUser = InferInsertModel<typeof users>;
export type NewDoctor = InferInsertModel<typeof doctor>;
export type NewDoctorEducation = InferInsertModel<typeof doctorEducation>;
export type NewDoctorMetaTag = InferInsertModel<typeof doctorMetaTags>;
export type NewDoctorExperience = InferInsertModel<typeof doctorExperience>;

// export const modeEnum = pgEnum("appointment_mode", ["online", "offline"]);
// export const subscriptionTypeEnum = pgEnum("subscription_type", ["basic",  "premium",  "enterprise",]);
// export const billingCycleEnum = pgEnum("billing_cycle", ["monthly",  "quarterly",  "yearly",]);
// export const consultationModeEnum = pgEnum("consultation_mode", ["zoom", "google_meet", "ms_teams"]);

// export const staff = pgTable("staff", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   password: text("password").notNull(),
//   designation: text("designation"),
//   roles: text("roles").array(), // Multiple roles
//   chambers: text("chambers"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const prescription = pgTable("prescription", {
//   id: serial("id").primaryKey(),
//   patientId: integer("patient_id")
//     .references(() => patient.id)
//     .notNull(),
//   doctorId: integer("doctor_id")
//     .references(() => doctor.id)
//     .notNull(), // Added doctorId
//   appointmentId: integer("appointment_id").references(() => appointment.id), // Added appointment reference
//   clinicalDiagnosis: text("clinical_diagnosis"),
//   additionalAdvice: text("additional_advice"),
//   drugs: text("drugs").array().notNull(),
//   nextFollowUp: timestamp("next_follow_up"),
//   notes: text("notes"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const drug = pgTable("drug", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   genericName: text("generic_name"),
//   brandName: text("brand_name"),
//   details: text("details"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const platformSubscription = pgTable("platform_subscription", {
//   id: serial("id").primaryKey(),
//   doctorId: integer("doctor_id")
//     .references(() => doctor.id)
//     .notNull(),
//   subscriptionType: subscriptionTypeEnum("subscription_type").notNull(),
//   price: integer("price"),
//   billingCycle: billingCycleEnum("billing_cycle"),
//   lastBilling: timestamp("last_billing"),
//   expireDate: timestamp("expire_date"),
//   verified: boolean("verified").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });
