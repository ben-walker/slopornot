ALTER TABLE "images" ADD COLUMN "source_id" text;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "author_name" text;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "author_url" text;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "model" text;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "ai_has_model" CHECK ("is_ai" = false OR "model" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "real_has_attribution" CHECK ("is_ai" = true OR (
      "author_name" IS NOT NULL
      AND "author_url" IS NOT NULL
      AND "source_id" IS NOT NULL
      AND "source_url" IS NOT NULL
    ));