UPDATE "feedback" AS f
SET "email" = u."email"
FROM "users" AS u
WHERE f."userId" = u."id" AND f."email" IS NULL;

UPDATE "feedback"
SET "rating" = 5
WHERE "rating" IS NULL;

ALTER TABLE "feedback"
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;
