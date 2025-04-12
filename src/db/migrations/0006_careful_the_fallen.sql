CREATE TYPE "public"."day_of_week" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');--> statement-breakpoint
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
ALTER TABLE "appointment_days" ADD CONSTRAINT "appointment_days_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_settings" ADD CONSTRAINT "appointment_settings_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_time_ranges" ADD CONSTRAINT "appointment_time_ranges_day_id_appointment_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."appointment_days"("id") ON DELETE cascade ON UPDATE no action;