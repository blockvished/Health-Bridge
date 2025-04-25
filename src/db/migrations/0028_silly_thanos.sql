ALTER TABLE "enableRating" RENAME TO "enable_rating";--> statement-breakpoint
ALTER TABLE "enable_rating" DROP CONSTRAINT "enableRating_doctorid_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "enable_rating" ADD CONSTRAINT "enable_rating_doctorid_doctor_id_fk" FOREIGN KEY ("doctorid") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;