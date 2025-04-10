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
ALTER TABLE "doctor_education" ADD CONSTRAINT "doctor_education_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_experience" ADD CONSTRAINT "doctor_experience_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;