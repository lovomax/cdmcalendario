/*
  Warnings:

  - Added the required column `price` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_forecasts" ADD COLUMN     "personalPrice" INTEGER;

-- AlterTable
ALTER TABLE "professional_services" ADD COLUMN     "personalPrice" INTEGER;
