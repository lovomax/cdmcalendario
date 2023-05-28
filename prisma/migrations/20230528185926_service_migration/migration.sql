-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "chosenService" INTEGER;

-- CreateTable
CREATE TABLE "professional_services" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "specializedId" INTEGER NOT NULL,

    CONSTRAINT "professional_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "professional_services_professionalId_idx" ON "professional_services"("professionalId");

-- CreateIndex
CREATE INDEX "professional_services_specializedId_idx" ON "professional_services"("specializedId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chosenService_fkey" FOREIGN KEY ("chosenService") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_services" ADD CONSTRAINT "professional_services_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_services" ADD CONSTRAINT "professional_services_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
