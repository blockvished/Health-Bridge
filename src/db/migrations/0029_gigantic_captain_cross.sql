CREATE TABLE "plan_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"feature_name" text NOT NULL,
	"enabled" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"yearly_price" integer NOT NULL,
	"staff_limit" integer NOT NULL,
	"chamber_limit" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;