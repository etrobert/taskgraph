ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "owner_id";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "visibility";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint
DROP TYPE "public"."visibility";