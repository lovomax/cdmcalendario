/*
  Warnings:

  - Added the required column `chosenField` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chosenForecast` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chosenIntervention` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chosenModality` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chosenPaymentMethod` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chosenSpecialty` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "chosenField" INTEGER NOT NULL,
ADD COLUMN     "chosenForecast" INTEGER NOT NULL,
ADD COLUMN     "chosenIntervention" INTEGER NOT NULL,
ADD COLUMN     "chosenModality" INTEGER NOT NULL,
ADD COLUMN     "chosenPaymentMethod" INTEGER NOT NULL,
ADD COLUMN     "chosenSpecialty" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenField_fkey" FOREIGN KEY ("chosenField") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenForecast_fkey" FOREIGN KEY ("chosenForecast") REFERENCES "forecasts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenIntervention_fkey" FOREIGN KEY ("chosenIntervention") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenModality_fkey" FOREIGN KEY ("chosenModality") REFERENCES "modalities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenSpecialty_fkey" FOREIGN KEY ("chosenSpecialty") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenPaymentMethod_fkey" FOREIGN KEY ("chosenPaymentMethod") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
