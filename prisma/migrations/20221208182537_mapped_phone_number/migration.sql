/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `user_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_number` to the `user_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_account_phoneNumber_key";

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone_number" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_account_phone_number_key" ON "user_account"("phone_number");
