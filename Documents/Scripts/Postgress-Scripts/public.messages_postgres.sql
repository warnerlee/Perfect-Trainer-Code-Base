CREATE TABLE "messages" (
  "message_id" integer PRIMARY KEY,
  "job_id" integer,
  "sender_id" integer,
  "receiver_id" integer,
  "message_content" text,
  "sent_at" timestamp DEFAULT (now()),
  "read_at" timestamp
);
