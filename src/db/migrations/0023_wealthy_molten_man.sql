ALTER TABLE "public"."medication_dosage" ALTER COLUMN "when_to_take" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."meal_time";--> statement-breakpoint
CREATE TYPE "public"."meal_time" AS ENUM('after_meal', 'before_meal', 'after_before_meal');--> statement-breakpoint
ALTER TABLE "public"."medication_dosage" ALTER COLUMN "when_to_take" SET DATA TYPE "public"."meal_time" USING "when_to_take"::"public"."meal_time";