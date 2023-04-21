/*
  Warnings:

  - You are about to drop the column `fieldId` on the `professional_fields` table. All the data in the column will be lost.
  - You are about to drop the column `forecastId` on the `professional_forecasts` table. All the data in the column will be lost.
  - You are about to drop the column `interventionId` on the `professional_interventions` table. All the data in the column will be lost.
  - You are about to drop the column `modalityId` on the `professional_modalities` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `professional_payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `specialtyId` on the `professional_specialties` table. All the data in the column will be lost.
  - Added the required column `specializedId` to the `professional_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializedId` to the `professional_forecasts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializedId` to the `professional_interventions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializedId` to the `professional_modalities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializedId` to the `professional_payment_methods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializedId` to the `professional_specialties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "professional_fields" DROP CONSTRAINT "professional_fields_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "professional_forecasts" DROP CONSTRAINT "professional_forecasts_forecastId_fkey";

-- DropForeignKey
ALTER TABLE "professional_interventions" DROP CONSTRAINT "professional_interventions_interventionId_fkey";

-- DropForeignKey
ALTER TABLE "professional_modalities" DROP CONSTRAINT "professional_modalities_modalityId_fkey";

-- DropForeignKey
ALTER TABLE "professional_payment_methods" DROP CONSTRAINT "professional_payment_methods_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "professional_specialties" DROP CONSTRAINT "professional_specialties_specialtyId_fkey";

-- DropIndex
DROP INDEX "professional_fields_fieldId_idx";

-- DropIndex
DROP INDEX "professional_forecasts_forecastId_idx";

-- DropIndex
DROP INDEX "professional_interventions_interventionId_idx";

-- DropIndex
DROP INDEX "professional_modalities_modalityId_idx";

-- DropIndex
DROP INDEX "professional_payment_methods_paymentMethodId_idx";

-- DropIndex
DROP INDEX "professional_specialties_specialtyId_idx";

-- AlterTable
ALTER TABLE "professional_fields" DROP COLUMN "fieldId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_forecasts" DROP COLUMN "forecastId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_interventions" DROP COLUMN "interventionId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_modalities" DROP COLUMN "modalityId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_payment_methods" DROP COLUMN "paymentMethodId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional_specialties" DROP COLUMN "specialtyId",
ADD COLUMN     "specializedId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "professional_fields_specializedId_idx" ON "professional_fields"("specializedId");

-- CreateIndex
CREATE INDEX "professional_forecasts_specializedId_idx" ON "professional_forecasts"("specializedId");

-- CreateIndex
CREATE INDEX "professional_interventions_specializedId_idx" ON "professional_interventions"("specializedId");

-- CreateIndex
CREATE INDEX "professional_modalities_specializedId_idx" ON "professional_modalities"("specializedId");

-- CreateIndex
CREATE INDEX "professional_payment_methods_specializedId_idx" ON "professional_payment_methods"("specializedId");

-- CreateIndex
CREATE INDEX "professional_specialties_specializedId_idx" ON "professional_specialties"("specializedId");

-- AddForeignKey
ALTER TABLE "professional_fields" ADD CONSTRAINT "professional_fields_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_forecasts" ADD CONSTRAINT "professional_forecasts_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "forecasts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_interventions" ADD CONSTRAINT "professional_interventions_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_modalities" ADD CONSTRAINT "professional_modalities_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "modalities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_payment_methods" ADD CONSTRAINT "professional_payment_methods_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_specialties" ADD CONSTRAINT "professional_specialties_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
