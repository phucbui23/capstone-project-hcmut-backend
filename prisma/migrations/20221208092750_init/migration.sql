/*
  Warnings:

  - You are about to drop the column `active_ingredients` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `alternative_name` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `negative_note` on the `medication` table. All the data in the column will be lost.
  - You are about to drop the column `positive_note` on the `medication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "medication" DROP COLUMN "active_ingredients",
DROP COLUMN "alternative_name",
DROP COLUMN "branch",
DROP COLUMN "color",
DROP COLUMN "negative_note",
DROP COLUMN "positive_note";
