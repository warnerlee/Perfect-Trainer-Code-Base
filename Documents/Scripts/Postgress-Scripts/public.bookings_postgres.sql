CREATE TABLE "bookings" (
  "booking_id" integer PRIMARY KEY,
  "job_id" integer,
  "trainee_id" integer,
  "trainer_id" integer,
  "scheduled_date" date,
  "scheduled_time" time,
  "duration" decimal,
  "location" varchar,
  "final_rate" decimal,
  "status" varchar,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "bookings"."status" IS 'scheduled, completed, cancelled, no_show';
