/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `article` table. All the data in the column will be lost.
  - The `frequency` column on the `medication_plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `user_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[attachmentId]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospital_id` to the `article` table without a default value. This is not possible if the table is not empty.
  - The required column `code` was added to the `user_account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('AS_NEEDED', 'DAILY', 'SELECTED_DAYS', 'DAY_INTERVAL', 'MONTH_INTERVAL');

-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_hospitalId_fkey";

-- AlterTable
ALTER TABLE "article" DROP COLUMN "hospitalId",
ADD COLUMN     "hospital_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "doctor_account" ALTER COLUMN "faculty" DROP NOT NULL,
ALTER COLUMN "year_of_experience" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medication_plan" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'AS_NEEDED';

-- AlterTable
ALTER TABLE "operator_account" ALTER COLUMN "phone_number" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_account" ALTER COLUMN "insurance_number" DROP NOT NULL,
ALTER COLUMN "username" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reminder_plan" ALTER COLUMN "is_taken" SET DEFAULT false,
ALTER COLUMN "is_skipped" SET DEFAULT false;

-- AlterTable
ALTER TABLE "reminder_plan_includes_medication" ADD COLUMN     "local_medication_name" TEXT;

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "attachmentId" INTEGER,
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
    "file_name" TEXT,
    "file_path" TEXT,
    "file_size" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_attachmentId_key" ON "user_account"("attachmentId");

-- AddForeignKey
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_attachment" ADD CONSTRAINT "article_includes_attachment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_attachment" ADD CONSTRAINT "article_includes_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
