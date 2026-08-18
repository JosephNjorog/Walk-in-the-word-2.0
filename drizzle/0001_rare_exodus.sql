ALTER TABLE "group_members" ADD COLUMN "muted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_tier" text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_status" text DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_expires_at" timestamp with time zone;