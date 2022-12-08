/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorManagesPatient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hospital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HospitalAdminAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationPlanIncludesMedication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OperatorAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OperatorAccountHasRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientSavesArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Qualification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReminderPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReminderPlanIncludesMedication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleAccessesResource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorAccount" DROP CONSTRAINT "DoctorAccount_hospitalAdminId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorAccount" DROP CONSTRAINT "DoctorAccount_operatorAccountId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorManagesPatient" DROP CONSTRAINT "DoctorManagesPatient_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorManagesPatient" DROP CONSTRAINT "DoctorManagesPatient_patientId_fkey";

-- DropForeignKey
ALTER TABLE "HospitalAdminAccount" DROP CONSTRAINT "HospitalAdminAccount_operatorAccountId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationPlan" DROP CONSTRAINT "MedicationPlan_doctorAccountId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationPlan" DROP CONSTRAINT "MedicationPlan_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationPlan" DROP CONSTRAINT "MedicationPlan_patientAccountId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationPlanIncludesMedication" DROP CONSTRAINT "MedicationPlanIncludesMedication_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationPlanIncludesMedication" DROP CONSTRAINT "MedicationPlanIncludesMedication_medicationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "OperatorAccount" DROP CONSTRAINT "OperatorAccount_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "OperatorAccount" DROP CONSTRAINT "OperatorAccount_userAccountId_fkey";

-- DropForeignKey
ALTER TABLE "OperatorAccountHasRole" DROP CONSTRAINT "OperatorAccountHasRole_operatorAccountId_fkey";

-- DropForeignKey
ALTER TABLE "OperatorAccountHasRole" DROP CONSTRAINT "OperatorAccountHasRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "PatientAccount" DROP CONSTRAINT "PatientAccount_userAccountId_fkey";

-- DropForeignKey
ALTER TABLE "PatientSavesArticle" DROP CONSTRAINT "PatientSavesArticle_articleId_fkey";

-- DropForeignKey
ALTER TABLE "PatientSavesArticle" DROP CONSTRAINT "PatientSavesArticle_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Qualification" DROP CONSTRAINT "Qualification_doctorAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ReminderPlan" DROP CONSTRAINT "ReminderPlan_medicationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "ReminderPlan" DROP CONSTRAINT "ReminderPlan_patientAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ReminderPlanIncludesMedication" DROP CONSTRAINT "ReminderPlanIncludesMedication_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "ReminderPlanIncludesMedication" DROP CONSTRAINT "ReminderPlanIncludesMedication_reminderPlanId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAccessesResource" DROP CONSTRAINT "RoleAccessesResource_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAccessesResource" DROP CONSTRAINT "RoleAccessesResource_roleId_fkey";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "DoctorAccount";

-- DropTable
DROP TABLE "DoctorManagesPatient";

-- DropTable
DROP TABLE "Hospital";

-- DropTable
DROP TABLE "HospitalAdminAccount";

-- DropTable
DROP TABLE "Medication";

-- DropTable
DROP TABLE "MedicationPlan";

-- DropTable
DROP TABLE "MedicationPlanIncludesMedication";

-- DropTable
DROP TABLE "OperatorAccount";

-- DropTable
DROP TABLE "OperatorAccountHasRole";

-- DropTable
DROP TABLE "PatientAccount";

-- DropTable
DROP TABLE "PatientSavesArticle";

-- DropTable
DROP TABLE "Qualification";

-- DropTable
DROP TABLE "ReminderPlan";

-- DropTable
DROP TABLE "ReminderPlanIncludesMedication";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RoleAccessesResource";

-- DropTable
DROP TABLE "UserAccount";

-- CreateTable
CREATE TABLE "resource" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resource_name_key" ON "resource"("name");
