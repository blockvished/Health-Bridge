CREATE TYPE "public"."user_role" AS ENUM('superadmin', 'admin', 'doctor', 'staff', 'patient');--> statement-breakpoint
CREATE TABLE "doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"city" text,
	"specialization" text,
	"degree" text,
	"experience" integer,
	"about_self" text,
	"about_clinic" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"image_link" text,
	"signature_link" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"phone" varchar(20),
	"phone_verified" boolean DEFAULT false,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"role" "user_role" DEFAULT 'patient' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;