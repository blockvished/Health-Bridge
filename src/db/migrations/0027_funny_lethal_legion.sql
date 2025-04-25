CREATE TABLE "enableRating" (
	"doctorid" integer PRIMARY KEY NOT NULL,
	"enable" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enableRating" ADD CONSTRAINT "enableRating_doctorid_doctor_id_fk" FOREIGN KEY ("doctorid") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;