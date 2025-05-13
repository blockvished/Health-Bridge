CREATE TYPE "public"."dosage_type" AS ENUM('0', '1', '2', '3', '4', '5', '1/2', '0.5 ml', '1 ml', '2 ml', '3 ml', '4 ml', '5 ml');--> statement-breakpoint
CREATE TYPE "public"."drug_type" AS ENUM('cap', 'tab', 'syp', 'oin');--> statement-breakpoint
CREATE TYPE "public"."meal_time" AS ENUM('after_meal', 'before_meal', 'after_before_meal');--> statement-breakpoint
CREATE TYPE "public"."time_frequency_type" AS ENUM('days', 'weeks', 'months');--> statement-breakpoint
CREATE TYPE "public"."appointment_mode" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TYPE "public"."consultation_platform" AS ENUM('google', 'zoom', 'teams');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('superadmin', 'admin', 'doctor', 'staff', 'patient');--> statement-breakpoint
CREATE TABLE "appointment_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"is_active" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "appointment_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"interval_minutes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_time_ranges" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_id" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"time_from" time NOT NULL,
	"time_to" time NOT NULL,
	"mode" "appointment_mode" NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"clinic_id" integer NOT NULL,
	"amount" integer DEFAULT 0,
	"payment_status" boolean DEFAULT false NOT NULL,
	"visit_status" boolean DEFAULT false NOT NULL,
	"reason" text,
	"is_cancelled" boolean DEFAULT false NOT NULL,
	"cancel_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clinic" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"image_link" text,
	"department" text,
	"appointment_limit" integer,
	"active" boolean DEFAULT true,
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"phone" varchar(20),
	"city" text,
	"pincode" varchar(10),
	"specialization" text,
	"degree" text,
	"experience" integer,
	"about_self" text,
	"about_clinic" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"image_link" text,
	"signature_link" text,
	"facebook_link" text,
	"instagram_link" text,
	"twitter_link" text,
	"linkedin_link" text,
	"seo_description" text,
	"plan_id" integer,
	"plan_type" "plan_type",
	"payment_status" boolean DEFAULT false NOT NULL,
	"payment_at" timestamp DEFAULT now(),
	"expire_at" timestamp DEFAULT now(),
	"account_status" boolean DEFAULT false NOT NULL,
	"account_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_bank_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"account_holder_name" varchar(255) NOT NULL,
	"bank_name" varchar(255) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"ifsc_code" varchar(20) NOT NULL,
	"upi_id" varchar(100),
	CONSTRAINT "doctor_bank_detail_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
CREATE TABLE "doctor_consultation" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"consultation_fees" integer,
	"mode" "consultation_platform" NOT NULL,
	"consultation_link" text,
	"is_live_consultation_enabled" boolean DEFAULT false,
	CONSTRAINT "doctor_consultation_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
CREATE TABLE "doctor_department" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"institution" varchar(255),
	"year_from" integer,
	"year_to" integer,
	"details" text,
	"sort_order" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctor_experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"organization" varchar(255),
	"year_from" integer,
	"year_to" integer,
	"details" text,
	"sort_order" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctor_meta_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"text" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enable_rating" (
	"doctorid" integer PRIMARY KEY NOT NULL,
	"enable" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication" (
	"id" serial PRIMARY KEY NOT NULL,
	"prescription_id" integer NOT NULL,
	"drug_type" "drug_type",
	"drug_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "medication_dosage" (
	"id" serial PRIMARY KEY NOT NULL,
	"medication_id" integer NOT NULL,
	"morning" "dosage_type",
	"afternoon" "dosage_type",
	"evening" "dosage_type",
	"night" "dosage_type",
	"when_to_take" "meal_time",
	"how_many_days_to_take_medication" integer,
	"medication_frequecy_type" time_frequency_type,
	"note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patient" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"abha_id" text,
	"age" integer,
	"weight" integer,
	"height" integer,
	"address" text,
	"gender" "gender",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "permission_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "permission_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "plan_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"feature_name" text NOT NULL,
	"enabled" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"yearly_price" integer NOT NULL,
	"staff_limit" integer NOT NULL,
	"chamber_limit" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescription" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"clinic_id" integer NOT NULL,
	"advice" text,
	"diagnosis_tests" text,
	"next_follow_up" integer,
	"next_follow_up_type" time_frequency_type,
	"prescription_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image_link" varchar(255),
	"clinic_id" integer,
	"role" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"permission_type_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"email_verified" boolean DEFAULT false,
	"phone" varchar(20) NOT NULL,
	"phone_verified" boolean DEFAULT false,
	"password" text,
	"salt" text,
	"role" "user_role" DEFAULT 'doctor' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "appointment_days" ADD CONSTRAINT "appointment_days_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_settings" ADD CONSTRAINT "appointment_settings_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_time_ranges" ADD CONSTRAINT "appointment_time_ranges_day_id_appointment_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."appointment_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic" ADD CONSTRAINT "clinic_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_bank_detail" ADD CONSTRAINT "doctor_bank_detail_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_consultation" ADD CONSTRAINT "doctor_consultation_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_department" ADD CONSTRAINT "doctor_department_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_education" ADD CONSTRAINT "doctor_education_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_experience" ADD CONSTRAINT "doctor_experience_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_meta_tags" ADD CONSTRAINT "doctor_meta_tags_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_ratings" ADD CONSTRAINT "doctor_ratings_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_ratings" ADD CONSTRAINT "doctor_ratings_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enable_rating" ADD CONSTRAINT "enable_rating_doctorid_doctor_id_fk" FOREIGN KEY ("doctorid") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication" ADD CONSTRAINT "medication_prescription_id_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_dosage" ADD CONSTRAINT "medication_dosage_medication_id_medication_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_permission_type_id_permission_types_id_fk" FOREIGN KEY ("permission_type_id") REFERENCES "public"."permission_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_doctor_tag" ON "doctor_meta_tags" USING btree ("doctor_id","tag");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_permission_unique" ON "staff_permissions" USING btree ("staff_id","permission_type_id");