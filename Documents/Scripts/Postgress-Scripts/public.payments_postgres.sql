CREATE TABLE "payments" (
  "payment_id" integer PRIMARY KEY,
  "booking_id" integer,
  "payer_id" integer,
  "payee_id" integer,
  "amount" decimal,
  "payment_method" varchar,
  "transaction_status" varchar,
  "stripe_payment_id" varchar,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "payments"."transaction_status" IS 'pending, completed, failed, refunded';
