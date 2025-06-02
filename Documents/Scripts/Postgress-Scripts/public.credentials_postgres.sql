CREATE TABLE "credentials" (
  "credential_id" integer PRIMARY KEY,
  "user_id" integer,
  "credential_name" varchar,
  "credential_giver" varchar,
  "date_achieved" date,
  "expiration_date" date,
  "verification_status" varchar,
  "credential_file_url" varchar
);

COMMENT ON COLUMN "credentials"."verification_status" IS 'pending, verified, expired';
