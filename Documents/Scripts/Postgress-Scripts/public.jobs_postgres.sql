CREATE TABLE "jobs" (
  "job_id" integer PRIMARY KEY,
  "poster_id" integer,
  "job_type_id" integer,
  "title" varchar,
  "description" text,
  "budget" decimal,
  "preferred_date" date,
  "preferred_time" time,
  "duration_hours" decimal,
  "location" varchar,
  "focus_area" varchar,
  "requirements" text,
  "status" varchar,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "jobs"."status" IS 'open, in_progress, completed, cancelled';
