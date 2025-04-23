ALTER TABLE "medication_dosage" ADD COLUMN "morning" "dosage_type";--> statement-breakpoint
ALTER TABLE "medication_dosage" ADD COLUMN "afternoon" "dosage_type";--> statement-breakpoint
ALTER TABLE "medication_dosage" ADD COLUMN "evening" "dosage_type";--> statement-breakpoint
ALTER TABLE "medication_dosage" ADD COLUMN "night" "dosage_type";--> statement-breakpoint
ALTER TABLE "medication_dosage" DROP COLUMN "dosage_type";--> statement-breakpoint
ALTER TABLE "medication_dosage" DROP COLUMN "dosage";