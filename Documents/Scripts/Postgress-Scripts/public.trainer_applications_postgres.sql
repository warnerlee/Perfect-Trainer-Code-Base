CREATE TABLE "trainer_applications" (
  "application_id" integer PRIMARY KEY,
  "applicant_email" varchar NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "phone" varchar,
  "experience_years" integer,
  "specializations" text,
  "certifications_summary" text,
  "why_join_us" text,
  "resume_url" varchar,
  "portfolio_url" varchar,
  "availability" text,
  "expected_hourly_rate" decimal,
  "application_status" varchar,
  "admin_notes" text,
  "applied_at" timestamp DEFAULT (now()),
  "reviewed_at" timestamp,
  "reviewed_by" integer
);

COMMENT ON COLUMN "trainer_applications"."application_status" IS 'pending, under_review, approved, rejected';
