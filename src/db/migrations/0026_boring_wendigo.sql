ALTER TABLE "doctor_ratings" DROP CONSTRAINT "doctor_ratings_doctor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "doctor_ratings" ADD CONSTRAINT "doctor_ratings_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;