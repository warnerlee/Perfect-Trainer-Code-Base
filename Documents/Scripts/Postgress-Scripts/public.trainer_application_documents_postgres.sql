CREATE TABLE "trainer_application_documents" (
  "document_id" integer PRIMARY KEY,
  "application_id" integer,
  "document_type" varchar,
  "document_name" varchar,
  "document_url" varchar,
  "uploaded_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "trainer_application_documents"."document_type" IS 'resume, certification, insurance, references';
