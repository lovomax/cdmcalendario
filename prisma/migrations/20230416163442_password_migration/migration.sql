-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_authId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
