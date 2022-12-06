-- CreateTable
CREATE TABLE "role_accesses_resource" (
    "resource_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_add" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_accesses_resource_pkey" PRIMARY KEY ("resource_id","role_id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_account_has_role" (
    "user_account_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_account_has_role_pkey" PRIMARY KEY ("user_account_id","role_id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" VARCHAR(255),
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "social_security_number" TEXT,
    "nationality" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operator_account" (
    "user_account_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "hospital_admin_account" (
    "operator_account_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "doctor_account" (
    "operator_account_id" INTEGER NOT NULL,
    "hospital_admin_account_id" INTEGER NOT NULL,
    "faculty" VARCHAR(255) NOT NULL,
    "year_of_experience" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "doctor_manages_patient" (
    "doctor_account_id" INTEGER NOT NULL,
    "patient_account_id" INTEGER NOT NULL,

    CONSTRAINT "doctor_manages_patient_pkey" PRIMARY KEY ("doctor_account_id","patient_account_id")
);

-- CreateTable
CREATE TABLE "qualification" (
    "doctor_account_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "expire_day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qualification_pkey" PRIMARY KEY ("doctor_account_id","name")
);

-- CreateTable
CREATE TABLE "patient_account" (
    "user_account_id" INTEGER NOT NULL,
    "insurance_number" VARCHAR(255) NOT NULL,
    "occupation" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hospitalId" INTEGER NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_saves_article" (
    "patient_account_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_saves_article_pkey" PRIMARY KEY ("patient_account_id","article_id")
);

-- CreateTable
CREATE TABLE "hospital" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_plan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "frequency" VARCHAR(255) NOT NULL,
    "note" TEXT,
    "stock_information" JSON NOT NULL,
    "taken_reminders_plan" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "doctor_account_id" INTEGER NOT NULL,
    "patient_account_id" INTEGER NOT NULL,

    CONSTRAINT "medication_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_plan" (
    "id" SERIAL NOT NULL,
    "is_taken" BOOLEAN NOT NULL,
    "is_skipped" BOOLEAN NOT NULL,
    "note" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "medication_plan_id" INTEGER NOT NULL,
    "patient_account_id" INTEGER NOT NULL,

    CONSTRAINT "reminder_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_plan_includes_medication" (
    "reminder_plan_id" INTEGER NOT NULL,
    "medication_id" INTEGER NOT NULL,
    "is_local" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reminder_plan_includes_medication_pkey" PRIMARY KEY ("reminder_plan_id","medication_id")
);

-- CreateTable
CREATE TABLE "medication" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "active_ingredients" TEXT,
    "positive_note" TEXT,
    "negative_note" TEXT,
    "alternative_name" VARCHAR(255),
    "description" TEXT,
    "color" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_username_key" ON "user_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_phoneNumber_key" ON "user_account"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_social_security_number_key" ON "user_account"("social_security_number");

-- CreateIndex
CREATE UNIQUE INDEX "operator_account_user_account_id_key" ON "operator_account"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_admin_account_operator_account_id_key" ON "hospital_admin_account"("operator_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_account_operator_account_id_key" ON "doctor_account"("operator_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_account_user_account_id_key" ON "patient_account"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_account_insurance_number_key" ON "patient_account"("insurance_number");

-- CreateIndex
CREATE UNIQUE INDEX "article_title_key" ON "article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_name_key" ON "hospital"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medication_code_key" ON "medication"("code");

-- CreateIndex
CREATE UNIQUE INDEX "medication_name_key" ON "medication"("name");

-- AddForeignKey
ALTER TABLE "role_accesses_resource" ADD CONSTRAINT "role_accesses_resource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_accesses_resource" ADD CONSTRAINT "role_accesses_resource_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_account_has_role" ADD CONSTRAINT "user_account_has_role_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_account_has_role" ADD CONSTRAINT "user_account_has_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_account" ADD CONSTRAINT "operator_account_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_account" ADD CONSTRAINT "operator_account_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_admin_account" ADD CONSTRAINT "hospital_admin_account_operator_account_id_fkey" FOREIGN KEY ("operator_account_id") REFERENCES "operator_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_account" ADD CONSTRAINT "doctor_account_operator_account_id_fkey" FOREIGN KEY ("operator_account_id") REFERENCES "operator_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_account" ADD CONSTRAINT "doctor_account_hospital_admin_account_id_fkey" FOREIGN KEY ("hospital_admin_account_id") REFERENCES "hospital_admin_account"("operator_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_manages_patient" ADD CONSTRAINT "doctor_manages_patient_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_manages_patient" ADD CONSTRAINT "doctor_manages_patient_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualification" ADD CONSTRAINT "qualification_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_account" ADD CONSTRAINT "patient_account_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_saves_article" ADD CONSTRAINT "patient_saves_article_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_saves_article" ADD CONSTRAINT "patient_saves_article_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_plan" ADD CONSTRAINT "medication_plan_doctor_account_id_fkey" FOREIGN KEY ("doctor_account_id") REFERENCES "doctor_account"("operator_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_plan" ADD CONSTRAINT "medication_plan_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan" ADD CONSTRAINT "reminder_plan_medication_plan_id_fkey" FOREIGN KEY ("medication_plan_id") REFERENCES "medication_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan" ADD CONSTRAINT "reminder_plan_patient_account_id_fkey" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_includes_medication" ADD CONSTRAINT "reminder_plan_includes_medication_reminder_plan_id_fkey" FOREIGN KEY ("reminder_plan_id") REFERENCES "reminder_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_plan_includes_medication" ADD CONSTRAINT "reminder_plan_includes_medication_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
