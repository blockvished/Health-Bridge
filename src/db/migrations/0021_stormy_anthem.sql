CREATE TABLE "medication_dosage" (
	"id" serial PRIMARY KEY NOT NULL,
	"medication_id" integer NOT NULL,
	"dosage_type" "dosage_type" NOT NULL,
	"dosage" varchar(50) NOT NULL,
	"when_to_take" "meal_time",
	"note" text,
	"how_many_days_to_take_medication" integer,
	"medication_frequecy_type" time_frequency_type,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "medication_dosage" ADD CONSTRAINT "medication_dosage_medication_id_medication_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "morning";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "afternoon";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "evening";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "night";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "when_to_take";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "note";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "how_many_days_to_take_medication";--> statement-breakpoint
ALTER TABLE "medication" DROP COLUMN "medication_frequecy_type";