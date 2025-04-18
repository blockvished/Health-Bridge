CREATE TYPE "public"."drug_type" AS ENUM('cap', 'tab', 'syp', 'oin');--> statement-breakpoint
ALTER TABLE "medication" ADD COLUMN "drug_type" "drug_type";--> statement-breakpoint
ALTER TABLE "prescription" DROP COLUMN "clinical_diagnosis";--> statement-breakpoint
ALTER TABLE "prescription" DROP COLUMN "additional_advice";