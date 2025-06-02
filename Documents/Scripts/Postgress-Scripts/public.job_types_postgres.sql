CREATE TABLE "job_types" (
  "job_type_id" integer PRIMARY KEY,
  "type_name" varchar,
  "description" text
);

COMMENT ON COLUMN "job_types"."type_name" IS 'training_session, find_gym_buddy, diet_plan, group_training, nutrition_consultation';
