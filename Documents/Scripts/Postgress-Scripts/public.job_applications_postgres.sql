CREATE TABLE "job_applications" (
  "application_id" integer PRIMARY KEY,
  "job_id" integer,
  "trainer_id" integer,
  "proposal_message" text,
  "proposed_rate" decimal,
  "availability" text,
  "status" varchar,
  "applied_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "job_applications"."status" IS 'pending, accepted, rejected';
