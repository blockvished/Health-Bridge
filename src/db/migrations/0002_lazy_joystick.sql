CREATE TABLE "doctor_meta_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "facebook_link" text;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "instagram_link" text;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "twitter_link" text;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "linkedin_link" text;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "doctor_meta_tags" ADD CONSTRAINT "doctor_meta_tags_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_doctor_tag" ON "doctor_meta_tags" USING btree ("doctor_id","tag");