-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" VARCHAR(255),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "lastActive" TIMESTAMP(3) NOT NULL,
    "socialSecurityNumber" TEXT,
    "nationality" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorAccount" (
    "userAccountId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "HospitalAdminAccount" (
    "operatorAccountId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DoctorAccount" (
    "operatorAccountId" INTEGER NOT NULL,
    "hospitalAdminId" INTEGER NOT NULL,
    "faculty" VARCHAR(255) NOT NULL,
    "yearOfExperience" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "PatientAccount" (
    "userAccountId" INTEGER NOT NULL,
    "occupation" VARCHAR(255),
    "insuranceNumber" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Qualification" (
    "doctorAccountId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "expireDay" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "MedicationPlan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "frequency" VARCHAR(255) NOT NULL,
    "note" TEXT,
    "takeRemindersPlan" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "doctorAccountId" INTEGER NOT NULL,
    "patientAccountId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,

    CONSTRAINT "MedicationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderPlan" (
    "id" SERIAL NOT NULL,
    "isTaken" BOOLEAN NOT NULL,
    "isSkipped" BOOLEAN NOT NULL,
    "note" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "medicationPlanId" INTEGER NOT NULL,
    "patientAccountId" INTEGER NOT NULL,

    CONSTRAINT "ReminderPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "activeIngredients" TEXT,
    "positiveNote" TEXT,
    "negativeNote" TEXT,
    "alternativeName" VARCHAR(255),
    "description" TEXT,
    "color" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hospitalId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorManagesPatient" (
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MedicationPlanIncludesMedication" (
    "medicationPlanId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ReminderPlanIncludesMedication" (
    "reminderPlanId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "isLocal" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "PatientSavesArticle" (
    "patientId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RoleAccessesResource" (
    "roleId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "canAdd" BOOLEAN NOT NULL DEFAULT false,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "OperatorAccountHasRole" (
    "operatorAccountId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_name_key" ON "Hospital"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_username_key" ON "UserAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_phoneNumber_key" ON "UserAccount"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_socialSecurityNumber_key" ON "UserAccount"("socialSecurityNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAccount_userAccountId_key" ON "OperatorAccount"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAccount_hospitalId_key" ON "OperatorAccount"("hospitalId");

-- CreateIndex
CREATE INDEX "OperatorAccount_userAccountId_idx" ON "OperatorAccount"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalAdminAccount_operatorAccountId_key" ON "HospitalAdminAccount"("operatorAccountId");

-- CreateIndex
CREATE INDEX "HospitalAdminAccount_operatorAccountId_idx" ON "HospitalAdminAccount"("operatorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorAccount_operatorAccountId_key" ON "DoctorAccount"("operatorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorAccount_hospitalAdminId_key" ON "DoctorAccount"("hospitalAdminId");

-- CreateIndex
CREATE INDEX "DoctorAccount_operatorAccountId_idx" ON "DoctorAccount"("operatorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccount_userAccountId_key" ON "PatientAccount"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccount_insuranceNumber_key" ON "PatientAccount"("insuranceNumber");

-- CreateIndex
CREATE INDEX "PatientAccount_userAccountId_idx" ON "PatientAccount"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_doctorAccountId_key" ON "Qualification"("doctorAccountId");

-- CreateIndex
CREATE INDEX "Qualification_doctorAccountId_name_idx" ON "Qualification"("doctorAccountId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationPlan_doctorAccountId_key" ON "MedicationPlan"("doctorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationPlan_patientAccountId_key" ON "MedicationPlan"("patientAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationPlan_hospitalId_key" ON "MedicationPlan"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderPlan_medicationPlanId_key" ON "ReminderPlan"("medicationPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderPlan_patientAccountId_key" ON "ReminderPlan"("patientAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_code_key" ON "Medication"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_name_key" ON "Medication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Article_hospitalId_key" ON "Article"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorManagesPatient_doctorId_key" ON "DoctorManagesPatient"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorManagesPatient_patientId_key" ON "DoctorManagesPatient"("patientId");

-- CreateIndex
CREATE INDEX "DoctorManagesPatient_doctorId_patientId_idx" ON "DoctorManagesPatient"("doctorId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationPlanIncludesMedication_medicationPlanId_key" ON "MedicationPlanIncludesMedication"("medicationPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationPlanIncludesMedication_medicationId_key" ON "MedicationPlanIncludesMedication"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationPlanIncludesMedication_medicationPlanId_medicatio_idx" ON "MedicationPlanIncludesMedication"("medicationPlanId", "medicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderPlanIncludesMedication_reminderPlanId_key" ON "ReminderPlanIncludesMedication"("reminderPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderPlanIncludesMedication_medicationId_key" ON "ReminderPlanIncludesMedication"("medicationId");

-- CreateIndex
CREATE INDEX "ReminderPlanIncludesMedication_reminderPlanId_medicationId_idx" ON "ReminderPlanIncludesMedication"("reminderPlanId", "medicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientSavesArticle_patientId_key" ON "PatientSavesArticle"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientSavesArticle_articleId_key" ON "PatientSavesArticle"("articleId");

-- CreateIndex
CREATE INDEX "PatientSavesArticle_patientId_articleId_idx" ON "PatientSavesArticle"("patientId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAccessesResource_roleId_key" ON "RoleAccessesResource"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAccessesResource_resourceId_key" ON "RoleAccessesResource"("resourceId");

-- CreateIndex
CREATE INDEX "RoleAccessesResource_roleId_resourceId_idx" ON "RoleAccessesResource"("roleId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAccountHasRole_operatorAccountId_key" ON "OperatorAccountHasRole"("operatorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAccountHasRole_roleId_key" ON "OperatorAccountHasRole"("roleId");

-- CreateIndex
CREATE INDEX "OperatorAccountHasRole_operatorAccountId_roleId_idx" ON "OperatorAccountHasRole"("operatorAccountId", "roleId");

-- AddForeignKey
ALTER TABLE "OperatorAccount" ADD CONSTRAINT "OperatorAccount_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorAccount" ADD CONSTRAINT "OperatorAccount_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalAdminAccount" ADD CONSTRAINT "HospitalAdminAccount_operatorAccountId_fkey" FOREIGN KEY ("operatorAccountId") REFERENCES "OperatorAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAccount" ADD CONSTRAINT "DoctorAccount_operatorAccountId_fkey" FOREIGN KEY ("operatorAccountId") REFERENCES "OperatorAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAccount" ADD CONSTRAINT "DoctorAccount_hospitalAdminId_fkey" FOREIGN KEY ("hospitalAdminId") REFERENCES "HospitalAdminAccount"("operatorAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAccount" ADD CONSTRAINT "PatientAccount_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_doctorAccountId_fkey" FOREIGN KEY ("doctorAccountId") REFERENCES "DoctorAccount"("operatorAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPlan" ADD CONSTRAINT "MedicationPlan_doctorAccountId_fkey" FOREIGN KEY ("doctorAccountId") REFERENCES "DoctorAccount"("operatorAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPlan" ADD CONSTRAINT "MedicationPlan_patientAccountId_fkey" FOREIGN KEY ("patientAccountId") REFERENCES "PatientAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPlan" ADD CONSTRAINT "MedicationPlan_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderPlan" ADD CONSTRAINT "ReminderPlan_medicationPlanId_fkey" FOREIGN KEY ("medicationPlanId") REFERENCES "MedicationPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderPlan" ADD CONSTRAINT "ReminderPlan_patientAccountId_fkey" FOREIGN KEY ("patientAccountId") REFERENCES "PatientAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorManagesPatient" ADD CONSTRAINT "DoctorManagesPatient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorAccount"("operatorAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorManagesPatient" ADD CONSTRAINT "DoctorManagesPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPlanIncludesMedication" ADD CONSTRAINT "MedicationPlanIncludesMedication_medicationPlanId_fkey" FOREIGN KEY ("medicationPlanId") REFERENCES "MedicationPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPlanIncludesMedication" ADD CONSTRAINT "MedicationPlanIncludesMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderPlanIncludesMedication" ADD CONSTRAINT "ReminderPlanIncludesMedication_reminderPlanId_fkey" FOREIGN KEY ("reminderPlanId") REFERENCES "ReminderPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderPlanIncludesMedication" ADD CONSTRAINT "ReminderPlanIncludesMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSavesArticle" ADD CONSTRAINT "PatientSavesArticle_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSavesArticle" ADD CONSTRAINT "PatientSavesArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccessesResource" ADD CONSTRAINT "RoleAccessesResource_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccessesResource" ADD CONSTRAINT "RoleAccessesResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorAccountHasRole" ADD CONSTRAINT "OperatorAccountHasRole_operatorAccountId_fkey" FOREIGN KEY ("operatorAccountId") REFERENCES "OperatorAccount"("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorAccountHasRole" ADD CONSTRAINT "OperatorAccountHasRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
