CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp with time zone,
	"password" text NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"has_two_factor_enabled" boolean DEFAULT false,
	"two_factor_confirmation_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
