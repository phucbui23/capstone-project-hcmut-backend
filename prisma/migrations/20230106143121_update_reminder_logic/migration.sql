/*
  Warnings:

  - You are about to drop the column `hospital_admin_account_id` on the `doctor_account` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `medication_plan` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `medication_plan` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `medication_plan` table. All the data in the column will be lost.
  - You are about to drop the column `stock_information` on the `medication_plan` table. All the data in the column will be lost.
  - You are about to drop the column `taken_reminders_plan` on the `medication_plan` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `operator_account` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `patient_account` table. All the data in the column will be lost.
  - You are about to drop the column `is_skipped` on the `reminder_plan` table. All the data in the column will be lost.
  - You are about to drop the column `is_taken` on the `reminder_plan` table. All the data in the column will be lost.
  - You are about to drop the column `sent_at` on the `reminder_plan` table. All the data in the column will be lost.
  - You are about to drop the `reminder_plan_includes_medication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_account_has_role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `operator_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `patient_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `start_date` to the `reminder_plan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password_hash` to the `user_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN');

-- DropForeignKey
ALTER TABLE "doctor_account" DROP CONSTRAINT "doctor_account_hospital_admin_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan_includes_medication" DROP CONSTRAINT "reminder_plan_includes_medication_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder_plan_includes_medication" DROP CONSTRAINT "reminder_plan_includes_medication_reminder_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "user_account_has_role" DROP CONSTRAINT "user_account_has_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_account_has_role" DROP CONSTRAINT "user_account_has_role_user_account_id_fkey";

-- AlterTable
ALTER TABLE "doctor_account" DROP COLUMN "hospital_admin_account_id";

-- AlterTable
ALTER TABLE "medication_plan" DROP COLUMN "end_date",
DROP COLUMN "frequency",
DROP COLUMN "start_date",
DROP COLUMN "stock_information",
DROP COLUMN "taken_reminders_plan";

-- AlterTable
ALTER TABLE "operator_account" DROP COLUMN "password_hash";

-- AlterTable
ALTER TABLE "patient_account" DROP COLUMN "password_hash";

-- AlterTable
ALTER TABLE "reminder_plan" DROP COLUMN "is_skipped",
DROP COLUMN "is_taken",
DROP COLUMN "sent_at",
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "local_medication_name" TEXT,
ADD COLUMN     "medication_id" INTEGER,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stock" INTEGER;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "name",
ADD COLUMN     "name" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "reminder_plan_includes_medication";

-- DropTable
DROP TABLE "user_account_has_role";

-- CreateTable
CREATE TABLE "reminder_plan_time" (
    "reminder_plan_id" INTEGER NOT NULL,
    "is_taken" BOOLEAN NOT NULL DEFAULT false,
    "is_skipped" BOOLEAN NOT NULL DEFAULT false,
    "time" TIMESTAMP(3) NOT NULL,
    "dosage" INTEGER NOT NULL DEFAULT 1,
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "reminder_plan_time_pkey" PRIMARY KEY ("reminder_plan_id","time")
);

-- CreateIndex
CREATE UNIQUE INDEX "operator_account_phone_number_key" ON "operator_account"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "patient_account_username_key" ON "patient_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- AddForeignKey
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan" ADD CONSTRAINT "reminder_plan_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_time" ADD CONSTRAINT "reminder_plan_time_reminder_plan_id_fkey" FOREIGN KEY ("reminder_plan_id") REFERENCES "reminder_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
