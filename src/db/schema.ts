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
export const modeEnum = pgEnum("appointment_mode", ["online", "offline"]);
export const patientTypeEnum = pgEnum("patient_type", ["new", "old"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const subscriptionTypeEnum = pgEnum("subscription_type", [
  "basic",
  "premium",
  "enterprise",
]);
export const billingCycleEnum = pgEnum("billing_cycle", [
  "monthly",
  "quarterly",
  "yearly",
]);

// Staff Table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  designation: text("designation"),
  roles: text("roles").array(), // Multiple roles
  chambers: text("chambers"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient Table
export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  age: integer("age"),
  weight: integer("weight"),
  presentAddress: text("present_address"),
  permanentAddress: text("permanent_address"),
  gender: genderEnum("gender"),
  doctorId: integer("doctor_id").notNull().references(() => doctor.id), // Foreign key to the doctor table
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctor = pgTable("doctor", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  country: text("country"),
  city: text("city"),
  specialism: text("specialization"),
  degree: text("degree"),
  experience: integer("experience"),
  aboutSelf: text("about_self"),
  aboutClinic: text("about_clinic"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointment Table
export const appointment = pgTable("appointment", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .references(() => patient.id)
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => doctor.id)
    .notNull(),
  date: timestamp("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  mode: modeEnum("mode").notNull(), // Using enum
  patientType: patientTypeEnum("patient_type").notNull(), // Using enum
  paymentStatus: boolean("payment_status").default(false),
  visitStatus: boolean("visit_status").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prescription Table
export const prescription = pgTable("prescription", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .references(() => patient.id)
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => doctor.id)
    .notNull(), // Added doctorId
  appointmentId: integer("appointment_id").references(() => appointment.id), // Added appointment reference
  clinicalDiagnosis: text("clinical_diagnosis"),
  additionalAdvice: text("additional_advice"),
  drugs: text("drugs").array().notNull(),
  nextFollowUp: timestamp("next_follow_up"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drug Table
export const drug = pgTable("drug", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  brandName: text("brand_name"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform Subscription Table
export const platformSubscription = pgTable("platform_subscription", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .references(() => doctor.id)
    .notNull(), // Added doctor reference
  subscriptionType: subscriptionTypeEnum("subscription_type").notNull(),
  price: integer("price"),
  billingCycle: billingCycleEnum("billing_cycle"),
  lastBilling: timestamp("last_billing"),
  expireDate: timestamp("expire_date"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations for better TypeScript support
export const patientRelations = relations(patient, ({ many }) => ({
  appointments: many(appointment),
  prescriptions: many(prescription),
}));

export const doctorRelations = relations(doctor, ({ many }) => ({
  appointments: many(appointment),
  prescriptions: many(prescription),
  subscriptions: many(platformSubscription),
}));

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
  patient: one(patient, {
    fields: [appointment.patientId],
    references: [patient.id],
  }),
  doctor: one(doctor, {
    fields: [appointment.doctorId],
    references: [doctor.id],
  }),
  prescriptions: many(prescription),
}));

export const prescriptionRelations = relations(prescription, ({ one }) => ({
  patient: one(patient, {
    fields: [prescription.patientId],
    references: [patient.id],
  }),
  doctor: one(doctor, {
    fields: [prescription.doctorId],
    references: [doctor.id],
  }),
  appointment: one(appointment, {
    fields: [prescription.appointmentId],
    references: [appointment.id],
  }),
}));

export const platformSubscriptionRelations = relations(
  platformSubscription,
  ({ one }) => ({
    doctor: one(doctor, {
      fields: [platformSubscription.doctorId],
      references: [doctor.id],
    }),
  }),
);
