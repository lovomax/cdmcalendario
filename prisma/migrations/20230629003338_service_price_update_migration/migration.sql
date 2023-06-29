/*
  Warnings:

  - Added the required column `price` to the `ServicePrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServicePrices" ADD COLUMN     "price" INTEGER NOT NULL;
