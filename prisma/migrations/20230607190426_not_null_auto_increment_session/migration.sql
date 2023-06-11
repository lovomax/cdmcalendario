/*
  Warnings:

  - Made the column `sessionNumber` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
CREATE SEQUENCE appointments_sessionnumber_seq;
ALTER TABLE "appointments" ALTER COLUMN "sessionNumber" SET NOT NULL,
ALTER COLUMN "sessionNumber" SET DEFAULT nextval('appointments_sessionnumber_seq');
ALTER SEQUENCE appointments_sessionnumber_seq OWNED BY "appointments"."sessionNumber";
