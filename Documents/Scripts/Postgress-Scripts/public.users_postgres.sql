CREATE TABLE "users" (
  "user_id" integer PRIMARY KEY,
  "user_type" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "phone" varchar,
  "date_of_birth" date,
  "height" decimal,
  "weight" decimal,
  "profile_photo_url" varchar,
  "bio" text,
  "specialty" varchar,
  "hourly_rate" decimal,
  "is_verified" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "users"."user_type" IS 'trainer, gym, trainee, admin';

COMMENT ON COLUMN "users"."specialty" IS 'for trainers';

COMMENT ON COLUMN "users"."hourly_rate" IS 'for trainers';
