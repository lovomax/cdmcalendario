/*
  Warnings:

  - Added the required column `university` to the `studies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearOfEgress` to the `studies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "studies" ADD COLUMN     "university" TEXT NOT NULL,
ADD COLUMN     "yearOfEgress" INTEGER NOT NULL;
