CREATE TYPE "public"."time_frequency_type" AS ENUM('days', 'weeks', 'months');--> statement-breakpoint
CREATE TABLE "prescription" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"clinical_diagnosis" text,
	"additional_advice" text,
	"advice" text,
	"diagnosis_tests" text,
	"next_follow_up" integer,
	"next_follow_up_type" time_frequency_type,
	"prescription_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;