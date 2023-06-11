-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleOfUser" "Role" NOT NULL DEFAULT 'USER';
