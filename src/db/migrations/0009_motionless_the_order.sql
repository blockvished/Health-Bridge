CREATE TYPE "public"."consultation_platform" AS ENUM('google', 'zoom', 'teams');--> statement-breakpoint
CREATE TABLE "doctor_consultation" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"consultation_fees" integer,
	"mode" "consultation_platform" NOT NULL,
	"consultation_link" text,
	CONSTRAINT "doctor_consultation_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
ALTER TABLE "doctor_consultation" ADD CONSTRAINT "doctor_consultation_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;