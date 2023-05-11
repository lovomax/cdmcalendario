-- CreateEnum
CREATE TYPE "State" AS ENUM ('BOOKED', 'CONFIRMED', 'CANCELED', 'RESCHEDULED', 'PENDING');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "state" "State" NOT NULL DEFAULT 'PENDING';
