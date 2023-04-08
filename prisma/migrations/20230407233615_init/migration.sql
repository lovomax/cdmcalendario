-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecasts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modalities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_numbers" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "roleOfNumber" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_fields" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "fieldId" INTEGER NOT NULL,

    CONSTRAINT "professional_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_forecasts" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "forecastId" INTEGER NOT NULL,

    CONSTRAINT "professional_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_interventions" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "interventionId" INTEGER NOT NULL,

    CONSTRAINT "professional_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_modalities" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "modalityId" INTEGER NOT NULL,

    CONSTRAINT "professional_modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_payment_methods" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,

    CONSTRAINT "professional_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_specialties" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "specialtyId" INTEGER NOT NULL,

    CONSTRAINT "professional_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rest_days" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,

    CONSTRAINT "rest_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "scheduleStart" TIMESTAMPTZ(6) NOT NULL,
    "scheduleEnd" TIMESTAMPTZ(6) NOT NULL,
    "restStart" TIMESTAMPTZ(6) NOT NULL,
    "restEnd" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_days" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "special_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_schedules" (
    "id" SERIAL NOT NULL,
    "specialDayId" INTEGER NOT NULL,
    "scheduleStart" TIMESTAMPTZ(6) NOT NULL,
    "scheduleEnd" TIMESTAMPTZ(6) NOT NULL,
    "restStart" TIMESTAMPTZ(6) NOT NULL,
    "restEnd" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "special_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studies" (
    "id" SERIAL NOT NULL,
    "professionalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "birthDate" TIMESTAMPTZ(6) NOT NULL,
    "authId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_numbers" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "roleOfNumber" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "whatsapp_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_professionalId_idx" ON "appointments"("professionalId");

-- CreateIndex
CREATE INDEX "appointments_userId_idx" ON "appointments"("userId");

-- CreateIndex
CREATE INDEX "phone_numbers_userId_idx" ON "phone_numbers"("userId");

-- CreateIndex
CREATE INDEX "professional_fields_fieldId_idx" ON "professional_fields"("fieldId");

-- CreateIndex
CREATE INDEX "professional_fields_professionalId_idx" ON "professional_fields"("professionalId");

-- CreateIndex
CREATE INDEX "professional_forecasts_forecastId_idx" ON "professional_forecasts"("forecastId");

-- CreateIndex
CREATE INDEX "professional_forecasts_professionalId_idx" ON "professional_forecasts"("professionalId");

-- CreateIndex
CREATE INDEX "professional_interventions_interventionId_idx" ON "professional_interventions"("interventionId");

-- CreateIndex
CREATE INDEX "professional_interventions_professionalId_idx" ON "professional_interventions"("professionalId");

-- CreateIndex
CREATE INDEX "professional_modalities_modalityId_idx" ON "professional_modalities"("modalityId");

-- CreateIndex
CREATE INDEX "professional_modalities_professionalId_idx" ON "professional_modalities"("professionalId");

-- CreateIndex
CREATE INDEX "professional_payment_methods_paymentMethodId_idx" ON "professional_payment_methods"("paymentMethodId");

-- CreateIndex
CREATE INDEX "professional_payment_methods_professionalId_idx" ON "professional_payment_methods"("professionalId");

-- CreateIndex
CREATE INDEX "professional_specialties_professionalId_idx" ON "professional_specialties"("professionalId");

-- CreateIndex
CREATE INDEX "professional_specialties_specialtyId_idx" ON "professional_specialties"("specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_userId_key" ON "professionals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "rest_days_dayOfWeek_key" ON "rest_days"("dayOfWeek");

-- CreateIndex
CREATE INDEX "rest_days_professionalId_idx" ON "rest_days"("professionalId");

-- CreateIndex
CREATE INDEX "schedules_professionalId_idx" ON "schedules"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "special_days_date_key" ON "special_days"("date");

-- CreateIndex
CREATE INDEX "special_days_professionalId_idx" ON "special_days"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "special_schedules_specialDayId_key" ON "special_schedules"("specialDayId");

-- CreateIndex
CREATE INDEX "studies_professionalId_idx" ON "studies"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_authId_key" ON "users"("authId");

-- CreateIndex
CREATE INDEX "whatsapp_numbers_userId_idx" ON "whatsapp_numbers"("userId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "phone_numbers" ADD CONSTRAINT "phone_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_fields" ADD CONSTRAINT "professional_fields_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_fields" ADD CONSTRAINT "professional_fields_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_forecasts" ADD CONSTRAINT "professional_forecasts_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "forecasts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_forecasts" ADD CONSTRAINT "professional_forecasts_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_interventions" ADD CONSTRAINT "professional_interventions_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_interventions" ADD CONSTRAINT "professional_interventions_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_modalities" ADD CONSTRAINT "professional_modalities_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "modalities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_modalities" ADD CONSTRAINT "professional_modalities_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_payment_methods" ADD CONSTRAINT "professional_payment_methods_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_payment_methods" ADD CONSTRAINT "professional_payment_methods_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_specialties" ADD CONSTRAINT "professional_specialties_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_specialties" ADD CONSTRAINT "professional_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rest_days" ADD CONSTRAINT "rest_days_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "special_days" ADD CONSTRAINT "special_days_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "special_schedules" ADD CONSTRAINT "special_schedules_specialDayId_fkey" FOREIGN KEY ("specialDayId") REFERENCES "special_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studies" ADD CONSTRAINT "studies_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_numbers" ADD CONSTRAINT "whatsapp_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
