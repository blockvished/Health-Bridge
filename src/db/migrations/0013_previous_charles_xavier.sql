CREATE TABLE "doctor_bank_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"account_holder_name" varchar(255) NOT NULL,
	"bank_name" varchar(255) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"ifsc_code" varchar(20) NOT NULL,
	"upi_id" varchar(100),
	CONSTRAINT "doctor_bank_detail_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
ALTER TABLE "doctor_bank_detail" ADD CONSTRAINT "doctor_bank_detail_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;