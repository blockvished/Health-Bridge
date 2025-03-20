CREATE TYPE "public"."sort_order_enum" AS ENUM('asc', 'desc');--> statement-breakpoint
CREATE TABLE "doctor_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"title" text NOT NULL,
	"year_from" integer,
	"year_to" integer,
	"details" text,
	"sort_order" "sort_order_enum"
);
--> statement-breakpoint
CREATE TABLE "doctor_experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"title" text NOT NULL,
	"year_from" integer,
	"year_to" integer,
	"details" text,
	"sort_order" "sort_order_enum"
);
--> statement-breakpoint
CREATE TABLE "doctor_meta_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_seo" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"description" text,
	CONSTRAINT "doctor_seo_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
ALTER TABLE "doctor_education" ADD CONSTRAINT "doctor_education_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_experience" ADD CONSTRAINT "doctor_experience_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_meta_tags" ADD CONSTRAINT "doctor_meta_tags_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_seo" ADD CONSTRAINT "doctor_seo_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;