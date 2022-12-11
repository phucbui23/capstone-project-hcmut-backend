/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `active_ingredients` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `alternative_name` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `negative_note` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `positive_note` on the `medication` table. All the data in the column will be lost.
  - The `frequency` column on the `medication_plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `password_hash` on the `user_account` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user_account` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user_account` table. All the data in the column will be lost.
  - The `gender` column on the `user_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `operator_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `patient_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospital_id` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `operator_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `operator_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `patient_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `patient_account` table without a default value. This is not possible if the table is not empty.
  - The required column `code` was added to the `user_account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('AS_NEEDED', 'DAILY', 'SELECTED_DAYS', 'DAY_INTERVAL', 'MONTH_INTERVAL');

-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_hospitalId_fkey";

-- DropIndex
DROP INDEX "user_account_phoneNumber_key";

-- DropIndex
DROP INDEX "user_account_username_key";

-- AlterTable
ALTER TABLE "article" DROP COLUMN "hospitalId",
ADD COLUMN     "hospital_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "doctor_account" ALTER COLUMN "faculty" DROP NOT NULL,
ALTER COLUMN "year_of_experience" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medication" DROP COLUMN "active_ingredients",
DROP COLUMN "alternative_name",
DROP COLUMN "branch",
DROP COLUMN "color",
DROP COLUMN "negative_note",
DROP COLUMN "positive_note";

-- AlterTable
ALTER TABLE "medication_plan" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'AS_NEEDED';

-- AlterTable
ALTER TABLE "operator_account" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(255),
ADD COLUMN     "username" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "patient_account" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(255) NOT NULL,
ADD COLUMN     "username" VARCHAR(255),
ALTER COLUMN "insurance_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reminder_plan" ALTER COLUMN "is_taken" SET DEFAULT false,
ALTER COLUMN "is_skipped" SET DEFAULT false;

-- AlterTable
ALTER TABLE "reminder_plan_includes_medication" ADD COLUMN     "local_medication_name" TEXT;

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "password_hash",
DROP COLUMN "phoneNumber",
DROP COLUMN "username",
ADD COLUMN     "birthday" DATE,
ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- CreateTable
CREATE TABLE "article_includes_attachment" (
    "article_id" INTEGER NOT NULL,
    "attachment_id" INTEGER NOT NULL,

    CONSTRAINT "article_includes_attachment_pkey" PRIMARY KEY ("article_id","attachment_id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "user_account_id" INTEGER,
    "file_name" TEXT,
    "file_path" TEXT,
    "file_size" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operator_account_username_key" ON "operator_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patient_account_phone_number_key" ON "patient_account"("phone_number");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_attachment" ADD CONSTRAINT "article_includes_attachment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_attachment" ADD CONSTRAINT "article_includes_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
