/*
  Warnings:

  - You are about to drop the column `password_hash` on the `user_account` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user_account` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `operator_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `patient_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password_hash` to the `operator_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `operator_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `patient_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `patient_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_account_phoneNumber_key";

-- DropIndex
DROP INDEX "user_account_username_key";

-- AlterTable
ALTER TABLE "operator_account" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(255) DEFAULT '',
ADD COLUMN     "username" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "patient_account" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(255) NOT NULL,
ADD COLUMN     "username" VARCHAR(255) DEFAULT '';

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "password_hash",
DROP COLUMN "phoneNumber",
DROP COLUMN "username";

-- CreateIndex
CREATE UNIQUE INDEX "operator_account_username_key" ON "operator_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patient_account_phone_number_key" ON "patient_account"("phone_number");
