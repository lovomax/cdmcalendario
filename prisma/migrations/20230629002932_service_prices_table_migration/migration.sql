-- CreateTable
CREATE TABLE "ServicePrices" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "forecastId" INTEGER NOT NULL,

    CONSTRAINT "ServicePrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD CONSTRAINT "ServicePrices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "professional_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD CONSTRAINT "ServicePrices_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "professional_forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
