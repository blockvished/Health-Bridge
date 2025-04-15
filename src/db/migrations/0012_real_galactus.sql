CREATE TABLE "doctor_department" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_department" ADD CONSTRAINT "doctor_department_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;