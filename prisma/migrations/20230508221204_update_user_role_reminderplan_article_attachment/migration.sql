/*
  Warnings:

  - You are about to drop the column `local_medication_name` on the `reminder_plan` table. All the data in the column will be lost.
  - You are about to drop the `article_includes_attachment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_account_id]` on the table `attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medication_plan_id]` on the table `attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[article_id]` on the table `attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "article_includes_attachment" DROP CONSTRAINT "article_includes_attachment_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_includes_attachment" DROP CONSTRAINT "article_includes_attachment_attachment_id_fkey";

-- DropForeignKey
ALTER TABLE "article_includes_tag" DROP CONSTRAINT "article_includes_tag_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_includes_tag" DROP CONSTRAINT "article_includes_tag_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_user_account_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_account" DROP CONSTRAINT "doctor_account_operator_account_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_manages_patient" DROP CONSTRAINT "doctor_manages_patient_doctor_account_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_manages_patient" DROP CONSTRAINT "doctor_manages_patient_patient_account_id_fkey";

-- DropForeignKey
ALTER TABLE "hospital_admin_account" DROP CONSTRAINT "hospital_admin_account_operator_account_id_fkey";

-- DropForeignKey
ALTER TABLE "medication_plan" DROP CONSTRAINT "medication_plan_doctor_account_id_fkey";

-- DropForeignKey
ALTER TABLE "medication_plan" DROP CONSTRAINT "medication_plan_patient_account_id_fkey";

-- DropForeignKey
ALTER TABLE "operator_account" DROP CONSTRAINT "operator_account_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "operator_account" DROP CONSTRAINT "operator_account_user_account_id_fkey";

-- DropForeignKey
ALTER TABLE "patient_account" DROP CONSTRAINT "patient_account_user_account_id_fkey";

-- DropForeignKey
ALTER TABLE "patient_saves_article" DROP CONSTRAINT "patient_saves_article_article_id_fkey";

-- DropForeignKey
ALTER TABLE "patient_saves_article" DROP CONSTRAINT "patient_saves_article_patient_account_id_fkey";

-- DropForeignKey
ALTER TABLE "qualification" DROP CONSTRAINT "qualification_doctor_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan" DROP CONSTRAINT "reminder_plan_medication_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan_time" DROP CONSTRAINT "reminder_plan_time_patient_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan_time" DROP CONSTRAINT "reminder_plan_time_reminderPlanMedicationPlanId_reminderPl_fkey";

-- DropForeignKey
ALTER TABLE "role_accesses_resource" DROP CONSTRAINT "role_accesses_resource_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "role_accesses_resource" DROP CONSTRAINT "role_accesses_resource_role_id_fkey";

-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "article_id" INTEGER,
ADD COLUMN     "medication_plan_id" INTEGER;

-- AlterTable
ALTER TABLE "medication_plan" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "count_skipped" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "count_taken" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "count_total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "roomId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "patient_account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reminder_plan" DROP COLUMN "local_medication_name";

-- DropTable
DROP TABLE "article_includes_attachment";

-- CreateTable
CREATE TABLE "local_reminder_plan" (
    "frequency" "Frequency" NOT NULL DEFAULT 'DAY_INTERVAL',
    "stock" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "local_medication_name" TEXT NOT NULL,
    "medication_plan_id" INTEGER NOT NULL,

    CONSTRAINT "local_reminder_plan_pkey" PRIMARY KEY ("medication_plan_id","local_medication_name")
);

-- CreateTable
CREATE TABLE "local_reminder_plan_time" (
    "is_taken" BOOLEAN NOT NULL DEFAULT false,
    "is_skipped" BOOLEAN NOT NULL DEFAULT false,
    "time" TIMESTAMP(3) NOT NULL,
    "dosage" INTEGER NOT NULL DEFAULT 1,
    "sent_at" TIMESTAMP(3),
    "patient_account_id" INTEGER NOT NULL,
    "localReminderPlanMedicationPlanId" INTEGER NOT NULL,
    "localReminderPlanLocalMedicationName" TEXT NOT NULL,

    CONSTRAINT "local_reminder_plan_time_pkey" PRIMARY KEY ("localReminderPlanMedicationPlanId","localReminderPlanLocalMedicationName","time")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachment_user_account_id_key" ON "attachment"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "attachment_medication_plan_id_key" ON "attachment"("medication_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "attachment_article_id_key" ON "attachment"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_code_key" ON "user_account"("code");

-- AddForeignKey
ALTER TABLE "role_accesses_resource" ADD CONSTRAINT "role_accesses_resource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_accesses_resource" ADD CONSTRAINT "role_accesses_resource_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_account" ADD CONSTRAINT "operator_account_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_account" ADD CONSTRAINT "operator_account_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_admin_account" ADD CONSTRAINT "hospital_admin_account_operator_account_id_fkey" FOREIGN KEY ("operator_account_id") REFERENCES "operator_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_account" ADD CONSTRAINT "doctor_account_operator_account_id_fkey" FOREIGN KEY ("operator_account_id") REFERENCES "operator_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_manages_patient" ADD CONSTRAINT "doctor_manages_patient_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_manages_patient" ADD CONSTRAINT "doctor_manages_patient_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualification" ADD CONSTRAINT "qualification_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_account" ADD CONSTRAINT "patient_account_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_saves_article" ADD CONSTRAINT "patient_saves_article_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_saves_article" ADD CONSTRAINT "patient_saves_article_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_plan" ADD CONSTRAINT "medication_plan_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_plan" ADD CONSTRAINT "medication_plan_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan" ADD CONSTRAINT "reminder_plan_medication_plan_id_fkey" FOREIGN KEY ("medication_plan_id") REFERENCES "medication_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_reminder_plan" ADD CONSTRAINT "local_reminder_plan_medication_plan_id_fkey" FOREIGN KEY ("medication_plan_id") REFERENCES "medication_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_time" ADD CONSTRAINT "reminder_plan_time_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_time" ADD CONSTRAINT "reminder_plan_time_reminderPlanMedicationPlanId_reminderPl_fkey" FOREIGN KEY ("reminderPlanMedicationPlanId", "reminderPlanMedicationId") REFERENCES "reminder_plan"("medication_plan_id", "medication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_reminder_plan_time" ADD CONSTRAINT "local_reminder_plan_time_localReminderPlanMedicationPlanId_fkey" FOREIGN KEY ("localReminderPlanMedicationPlanId", "localReminderPlanLocalMedicationName") REFERENCES "local_reminder_plan"("medication_plan_id", "local_medication_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_reminder_plan_time" ADD CONSTRAINT "local_reminder_plan_time_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_medication_plan_id_fkey" FOREIGN KEY ("medication_plan_id") REFERENCES "medication_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_tag" ADD CONSTRAINT "article_includes_tag_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_includes_tag" ADD CONSTRAINT "article_includes_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
