-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "chosenField" DROP NOT NULL,
ALTER COLUMN "chosenForecast" DROP NOT NULL,
ALTER COLUMN "chosenIntervention" DROP NOT NULL,
ALTER COLUMN "chosenModality" DROP NOT NULL,
ALTER COLUMN "chosenPaymentMethod" DROP NOT NULL,
ALTER COLUMN "chosenSpecialty" DROP NOT NULL;
