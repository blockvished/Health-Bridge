import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  doublePrecision,
  time,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/pg-core";

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

export const TimeFrequencyType = pgEnum("time_frequency_type", [
  "days",
  "weeks",
  "months",
]);

export const MealTimeType = pgEnum("meal_time", [
  "after_meal",
  "before_meal",
  "after_before_meal",
]);

export const DosageType = pgEnum("dosage_type", [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "1/2",
  "0.5 ml",
  "1 ml",
  "2 ml",
  "3 ml",
  "4 ml",
  "5 ml",
]);

export const DrugType = pgEnum("drug_type", ["cap", "tab", "syp", "oin"]);

export const planTypeEnum = pgEnum("plan_type", ["monthly", "yearly"]);

export const postStatusEnum = pgEnum("post_status", [
  "scheduled",
  "posted",
  "failed",
]);

///
// Users
///
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  email_verified: boolean("email_verified").default(false),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  phone_verified: boolean("phone_verified").default(false),
  password_hash: text("password"),
  salt: text("salt"),
  role: userRoleEnum("role").default("doctor").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull().unique(), // e.g., "twitter"
  accountName: text("account_name"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  autoposting: boolean("autoposting").default(false),
  disconnected: boolean("disconnected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // BASIC, CLASSIC, PREMIUM
  monthlyPrice: integer("monthly_price").notNull(),
  yearlyPrice: integer("yearly_price").notNull(),
  staffLimit: integer("staff_limit").notNull(),
  chamberLimit: integer("chamber_limit").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const planFeatures = pgTable("plan_features", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id)
    .notNull(),
  featureName: text("feature_name").notNull(),
  enabled: boolean("enabled").notNull(),
});

// Optional: Define relations
export const planRelations = relations(plans, ({ many }) => ({
  features: many(planFeatures),
}));

export const planFeatureRelations = relations(planFeatures, ({ one }) => ({
  plan: one(plans, {
    fields: [planFeatures.planId],
    references: [plans.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  patient: one(patient, {
    fields: [users.id], // Specify the field in the 'users' table
    references: [patient.userId], // Specify the referenced field in the 'patient' table
  }),
  doctor: one(doctor, {
    fields: [users.id], // Specify the field in the 'users' table
    references: [doctor.userId], // Specify the referenced field in the 'doctor' table
  }),
  staff: one(staff, {
    fields: [users.id], // Specify the field in the 'users' table
    references: [staff.userId], // Specify the referenced field in the 'doctor' table
  }),
}));

///
// Doctor
///
export const doctor = pgTable("doctor", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  city: text("city"),
  pincode: varchar("pincode", { length: 10 }),
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

  planId: integer("plan_id").references(() => plans.id), // Foreign key to plans table
  planType: planTypeEnum("plan_type"),
  paymentStatus: boolean("payment_status").default(false).notNull(),
  paymentAt: timestamp("payment_at").defaultNow(),
  expireAt: timestamp("expire_at").defaultNow(),
  accountStatus: boolean("account_status").default(false).notNull(),
  accountVerified: boolean("account_verified").default(false).notNull(),
});

export const socialPlatforms = pgTable("social_platforms", {
  id: serial("id").primaryKey(), // Use serial for auto-increment
  name: varchar("name", { length: 255 }).notNull(), // e.g., 'Facebook', 'Twitter'
});

export const socialPlatformRelations = relations(socialPlatforms, ({ many }) => ({
    postSocialPlatforms: many(post_social_platform),
}));


// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id") // changed to doctor_id
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }), // changed to doctor
  content: text("content").notNull(),
  imageLocalLink: text("image_local_link"),
  status: postStatusEnum("status").default("scheduled").notNull(), // 'scheduled', 'posted', 'failed'
  interactions: integer("interactions").default(0),
  publishedBy: varchar("published_by", { length: 255 }),
  scheduledTime: timestamp("scheduled_time"),// bull mq
  createdAt: timestamp("created_at").defaultNow(),
});

export const postRelations = relations(posts, ({ many }) => ({
    postSocialPlatforms: many(post_social_platform),
}));

// New table to link posts and social platforms
export const post_social_platform = pgTable(
  "post_social_platform",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    socialPlatformId: integer("social_platform_id")
      .notNull()
      .references(() => socialPlatforms.id, { onDelete: "cascade" }),
    // Add any additional fields relevant to the relationship
    // e.g., a timestamp for when the post was published on the platform
    publishedAt: timestamp("published_at"),
    // You might also want to track the status of the post on each platform
    status: postStatusEnum("status").default("scheduled").notNull(),
  },
  (table) => ({
    // Composite primary key (optional, if you want to enforce unique pairs)
    // You might not need this if 'id' is already a primary key
    // primaryKey: [table.postId, table.socialPlatformId],

    //  indexes (optional, but recommended for performance)
    postSocialPlatformIdIdx: index("post_social_platform_id_idx").on(
      table.postId,
      table.socialPlatformId
    ),
  })
);

export const postSocialPlatformRelations = relations(post_social_platform, ({ one }) => ({
    post: one(posts, {
        fields: [post_social_platform.postId],
        references: [posts.id],
    }),
    socialPlatform: one(socialPlatforms, {
        fields: [post_social_platform.socialPlatformId],
        references: [socialPlatforms.id],
    }),
}));

export const doctor_social_media_analytics = pgTable(
  "doctor_social_media_analytics",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id")
      .notNull()
      .references(() => doctor.id, { onDelete: "cascade" }),
    socialPlatformId: integer("social_platform_id")
      .notNull()
      .references(() => socialPlatforms.id, { onDelete: "cascade" }),
    totalFollowers: integer("total_followers").notNull(),
    newFollowers: integer("new_followers").notNull(),
    numberOfPosts: integer("number_of_posts").notNull(),
    reach: doublePrecision("reach").notNull(), // Use double for percentage
    engagement: doublePrecision("engagement").notNull(), // Use double for percentage
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

export const doctorRelations = relations(doctor, ({ one, many }) => ({
  user: one(users, {
    fields: [doctor.userId],
    references: [users.id],
  }),
  patients: many(patient),
  metaTags: many(doctorMetaTags),
  educations: many(doctorEducation),
  experiences: many(doctorExperience),
  socialConnections: many(socialConnections),
  posts: many(posts),
}));

//
// Patient
//
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

export const patientRelations = relations(patient, ({ one, many }) => ({
  user: one(users, {
    fields: [patient.userId],
    references: [users.id],
  }),
  prescription: many(prescription),
  doctor: one(doctor, {
    fields: [patient.doctorId],
    references: [doctor.id],
  }),
}));

export const doctor_ratings = pgTable("doctor_ratings", {
  id: serial("id").primaryKey(),
  patientid: integer("patient_id")
    .notNull()
    .references(() => patient.id), // Assuming you have a 'patient' table
  doctorid: integer("doctor_id")
    .notNull()
    .references(() => doctor.id), // Assuming doctors are in your 'users' table
  rating: integer("rating").notNull(),
  text: text("text"), // Optional text feedback
  createdAt: timestamp("created_at").defaultNow(), // Automatically record creation time
});

export const enableRating = pgTable("enable_rating", {
  doctorid: integer("doctorid")
    .references(() => doctor.id, { onDelete: "cascade" })
    .primaryKey(),
  enable: boolean("enable").notNull(),
});

// clinic

export const clinic = pgTable("clinic", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id") // Foreign key linking to the doctor table
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }), // Use onDelete: "cascade" to automatically delete clinics when the associated doctor is deleted
  name: varchar("name", { length: 255 }).notNull(),
  imageLink: text("image_link"),
  department: text("department"),
  appointmentLimit: integer("appointment_limit"),
  active: boolean("active").default(true),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id") // Add this new field
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  imageLink: varchar("image_link", { length: 255 }),
  clinicId: integer("clinic_id").references(() => clinic.id, {
    onDelete: "set null",
  }),
  role: varchar("role", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define all possible permission types
export const permissionTypes = pgTable("permission_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for many-to-many relationship between staff and permissions
export const staffPermissions = pgTable(
  "staff_permissions",
  {
    id: serial("id").primaryKey(),
    staffId: integer("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    permissionTypeId: integer("permission_type_id")
      .notNull()
      .references(() => permissionTypes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      // Create a unique constraint to prevent duplicate permissions
      unq: uniqueIndex("staff_permission_unique").on(
        table.staffId,
        table.permissionTypeId
      ),
    };
  }
);

export const prescription = pgTable("prescription", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctor.id, { onDelete: "cascade" }),
  clinicId: integer("clinic_id")
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
  advice: text("advice"),
  diagnosisTests: text("diagnosis_tests"),
  nextFollowUp: integer("next_follow_up"),
  nextFollowUpType: TimeFrequencyType("next_follow_up_type"), // Use the enum here
  prescriptionNotes: text("prescription_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prescriptionRelations = relations(
  prescription,
  ({ one, many }) => ({
    patient: one(patient, {
      fields: [prescription.patientId],
      references: [patient.id],
    }),
    doctor: one(doctor, {
      fields: [prescription.doctorId],
      references: [doctor.id],
    }),
    clinic: one(clinic, {
      fields: [prescription.clinicId],
      references: [clinic.id],
    }),
    medication: many(medication),
  })
);

export const medication = pgTable("medication", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id")
    .notNull()
    .references(() => prescription.id, { onDelete: "cascade" }),
  drugType: DrugType("drug_type"),
  drugName: varchar("drug_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicationRelations = relations(medication, ({ one, many }) => ({
  prescription: one(prescription, {
    fields: [medication.prescriptionId],
    references: [prescription.id],
  }),
  medicationDosage: many(medicationDosage),
}));

export const medicationDosage = pgTable("medication_dosage", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medication.id, { onDelete: "cascade" }),
  morning: DosageType("morning"),
  afternoon: DosageType("afternoon"),
  evening: DosageType("evening"),
  night: DosageType("night"),
  whenToTake: MealTimeType("when_to_take"),
  howManyDaysToTakeMedication: integer("how_many_days_to_take_medication"),
  medicationFrequecyType: TimeFrequencyType("medication_frequecy_type"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicationDosageRelations = relations(
  medicationDosage,
  ({ one }) => ({
    medication: one(medication, {
      fields: [medicationDosage.medicationId],
      references: [medication.id],
    }),
  })
);

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
  clinicId: integer("clinic_id")
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
  amount: integer("amount").default(0),
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
