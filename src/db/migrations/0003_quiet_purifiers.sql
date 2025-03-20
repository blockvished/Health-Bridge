ALTER TABLE "doctor_education" ALTER COLUMN "sort_order" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "doctor_experience" ALTER COLUMN "sort_order" SET DATA TYPE integer;--> statement-breakpoint
DROP TYPE "public"."sort_order_enum";