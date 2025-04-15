ALTER TABLE "appointments" ADD COLUMN "is_cancelled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "cancel_reason" text;