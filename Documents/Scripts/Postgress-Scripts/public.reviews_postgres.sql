CREATE TABLE "reviews" (
  "review_id" integer PRIMARY KEY,
  "booking_id" integer,
  "reviewer_id" integer,
  "reviewee_id" integer,
  "rating" integer,
  "comment" text,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "reviews"."rating" IS '1-5 scale';
