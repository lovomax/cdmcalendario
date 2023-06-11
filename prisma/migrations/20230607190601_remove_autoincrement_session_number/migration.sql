-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "sessionNumber" DROP DEFAULT;
DROP SEQUENCE "appointments_sessionnumber_seq";
