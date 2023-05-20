-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userForecastId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userForecastId_fkey" FOREIGN KEY ("userForecastId") REFERENCES "forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
