CREATE TYPE "public"."consultation_mode" AS ENUM('zoom', 'google_meet', 'ms_teams');--> statement-breakpoint
CREATE TABLE "doctor_consultation" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"consultation_fees" integer,
	"mode" "consultation_mode",
	"consultation_link" text,
	CONSTRAINT "doctor_consultation_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
CREATE TABLE "doctor_custom_js" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"custom_js" text,
	CONSTRAINT "doctor_custom_js_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
CREATE TABLE "doctor_social" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"facebook" text,
	"twitter" text,
	"instagram" text,
	"linkedin" text,
	CONSTRAINT "doctor_social_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
ALTER TABLE "doctor_consultation" ADD CONSTRAINT "doctor_consultation_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_custom_js" ADD CONSTRAINT "doctor_custom_js_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_social" ADD CONSTRAINT "doctor_social_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;