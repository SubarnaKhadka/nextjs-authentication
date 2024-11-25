CREATE TABLE IF NOT EXISTS "two-factor-token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "two-factor-token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "two_factor_tokens_unique" ON "two-factor-token" USING btree ("email","token");