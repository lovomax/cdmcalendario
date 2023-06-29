/*
  Warnings:

  - Added the required column `forecastSpecializedId` to the `ServicePrices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceSpecializedId` to the `ServicePrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServicePrices" ADD COLUMN     "forecastSpecializedId" INTEGER NOT NULL,
ADD COLUMN     "serviceSpecializedId" INTEGER NOT NULL;
