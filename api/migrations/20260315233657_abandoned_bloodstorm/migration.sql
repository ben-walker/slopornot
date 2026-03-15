CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"set_id" uuid NOT NULL,
	"storage_url" text NOT NULL,
	"is_ai" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"date" date NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_set_id_sets_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("id");