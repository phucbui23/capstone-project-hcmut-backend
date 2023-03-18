/*
  Warnings:

  - The values [AS_NEEDED,DAILY,MONTH_INTERVAL] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('SELECTED_DAYS', 'DAY_INTERVAL');
ALTER TABLE "reminder_plan" ALTER COLUMN "frequency" DROP DEFAULT;
ALTER TABLE "reminder_plan" ALTER COLUMN "frequency" TYPE "Frequency_new" USING ("frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "Frequency_old";
ALTER TABLE "reminder_plan" ALTER COLUMN "frequency" SET DEFAULT 'DAY_INTERVAL';
COMMIT;

-- AlterTable
ALTER TABLE "reminder_plan" ALTER COLUMN "frequency" SET DEFAULT 'DAY_INTERVAL';
