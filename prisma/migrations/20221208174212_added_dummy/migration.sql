/*
  Warnings:

  - A unique constraint covering the columns `[dummy]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "dummy" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_dummy_key" ON "user_account"("dummy");
