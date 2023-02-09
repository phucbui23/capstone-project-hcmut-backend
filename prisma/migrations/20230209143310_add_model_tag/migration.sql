/*
  Warnings:

  - The primary key for the `reminder_plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `reminder_plan` table. All the data in the column will be lost.
  - You are about to drop the column `patient_account_id` on the `reminder_plan` table. All the data in the column will be lost.
  - The primary key for the `reminder_plan_time` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reminder_plan_id` on the `reminder_plan_time` table. All the data in the column will be lost.
  - Made the column `medication_id` on table `reminder_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `reminder_plan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `patient_account_id` to the `reminder_plan_time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderPlanMedicationId` to the `reminder_plan_time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderPlanMedicationPlanId` to the `reminder_plan_time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "medication_plan" DROP CONSTRAINT "medication_plan_doctor_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan" DROP CONSTRAINT "reminder_plan_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan" DROP CONSTRAINT "reminder_plan_patient_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan_time" DROP CONSTRAINT "reminder_plan_time_reminder_plan_id_fkey";

-- AlterTable
ALTER TABLE "medication_plan" ALTER COLUMN "doctor_account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reminder_plan" DROP CONSTRAINT "reminder_plan_pkey",
DROP COLUMN "id",
DROP COLUMN "patient_account_id",
ALTER COLUMN "medication_id" SET NOT NULL,
ALTER COLUMN "stock" SET NOT NULL,
ADD CONSTRAINT "reminder_plan_pkey" PRIMARY KEY ("medication_plan_id", "medication_id");

-- AlterTable
ALTER TABLE "reminder_plan_time" DROP CONSTRAINT "reminder_plan_time_pkey",
DROP COLUMN "reminder_plan_id",
ADD COLUMN     "patient_account_id" INTEGER NOT NULL,
ADD COLUMN     "reminderPlanMedicationId" INTEGER NOT NULL,
ADD COLUMN     "reminderPlanMedicationPlanId" INTEGER NOT NULL,
ADD CONSTRAINT "reminder_plan_time_pkey" PRIMARY KEY ("reminderPlanMedicationPlanId", "reminderPlanMedicationId", "time");

-- CreateTable
CREATE TABLE "article_includes_tag" (
    "article_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "article_includes_tag_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "medication_plan" ADD CONSTRAINT "medication_plan_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan" ADD CONSTRAINT "reminder_plan_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_time" ADD CONSTRAINT "reminder_plan_time_reminderPlanMedicationPlanId_reminderPl_fkey" FOREIGN KEY ("reminderPlanMedicationPlanId", "reminderPlanMedicationId") REFERENCES "reminder_plan"("medication_plan_id", "medication_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_time" ADD CONSTRAINT "reminder_plan_time_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_tag" ADD CONSTRAINT "article_includes_tag_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_tag" ADD CONSTRAINT "article_includes_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
