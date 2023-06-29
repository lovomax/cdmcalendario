/*
  Warnings:

  - You are about to drop the column `personalPrice` on the `professional_forecasts` table. All the data in the column will be lost.
  - You are about to drop the column `personalPrice` on the `professional_services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professional_forecasts" DROP COLUMN "personalPrice";

-- AlterTable
ALTER TABLE "professional_services" DROP COLUMN "personalPrice";
