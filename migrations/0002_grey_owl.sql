CREATE TABLE IF NOT EXISTS "verification-token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" text NOT NULL,
	"expires" date,
	CONSTRAINT "verification-token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_token_unique" ON "verification-token" USING btree ("email","token");