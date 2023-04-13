/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "rut" DROP NOT NULL,
ALTER COLUMN "birthDate" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_rut_key" ON "users"("rut");
