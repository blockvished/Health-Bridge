CREATE TYPE "public"."dosage_type" AS ENUM('0', '1', '2', '3', '4', '5', '1/2', '0.5 ml', '1 ml', '2 ml', '3 ml', '4 ml', '5 ml');--> statement-breakpoint
CREATE TYPE "public"."meal_time" AS ENUM('after_meal', 'before_meal', 'after/before_meal');--> statement-breakpoint
CREATE TABLE "medication" (
	"id" serial PRIMARY KEY NOT NULL,
	"prescription_id" integer NOT NULL,
	"drug_name" varchar(255) NOT NULL,
	"morning" "dosage_type",
	"afternoon" "dosage_type",
	"evening" "dosage_type",
	"night" "dosage_type",
	"when_to_take" "meal_time",
	"note" text,
	"how_many_days_to_take_medication" integer,
	"medication_frequecy_type" time_frequency_type,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "medication" ADD CONSTRAINT "medication_prescription_id_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("id") ON DELETE cascade ON UPDATE no action;