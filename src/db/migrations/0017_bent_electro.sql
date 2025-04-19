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
ALTER TABLE "clinic" ADD CONSTRAINT "clinic_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;