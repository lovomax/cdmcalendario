/*
  Warnings:

  - A unique constraint covering the columns `[dayOfWeek]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schedules_dayOfWeek_key" ON "schedules"("dayOfWeek");
