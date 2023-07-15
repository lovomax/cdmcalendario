/*
  Warnings:

  - You are about to drop the `ServicePrices` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[oldUserId]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[oldId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ServicePrices" DROP CONSTRAINT "ServicePrices_forecastId_fkey";

-- DropForeignKey
ALTER TABLE "ServicePrices" DROP CONSTRAINT "ServicePrices_serviceId_fkey";

-- AlterTable
ALTER TABLE "professionals" ADD COLUMN     "oldUserId" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "oldId" INTEGER;

-- DropTable
DROP TABLE "ServicePrices";

-- CreateTable
CREATE TABLE "service_prices" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceSpecializedId" INTEGER NOT NULL,
    "forecastId" INTEGER NOT NULL,
    "forecastSpecializedId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_oldUserId_key" ON "professionals"("oldUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_oldId_key" ON "users"("oldId");

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "professional_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "professional_forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
