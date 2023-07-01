-- CreateTable
CREATE TABLE "professional_credits" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "professional_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_credits_professionalId_key" ON "professional_credits"("professionalId");

-- AddForeignKey
ALTER TABLE "professional_credits" ADD CONSTRAINT "professional_credits_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
