ALTER TABLE "urls" ALTER COLUMN "shortUrl" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "urls" ALTER COLUMN "shortUrl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "targetUrl" text;--> statement-breakpoint
ALTER TABLE "urls" DROP COLUMN "longUrl";--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_shortUrl_unique" UNIQUE("shortUrl");