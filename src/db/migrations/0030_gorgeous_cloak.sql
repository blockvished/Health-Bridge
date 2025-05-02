ALTER TABLE "doctor" ADD COLUMN "plan_id" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "account_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "payment_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor" ADD COLUMN "account_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;