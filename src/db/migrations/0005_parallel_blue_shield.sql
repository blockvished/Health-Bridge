CREATE TYPE "public"."plan_type" AS ENUM('monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "plan_type" "plan_type";