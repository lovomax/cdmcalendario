-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "Appointments" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_Appointments" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Fields" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_Fields" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Forecasts" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_Forecasts" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Interventions" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_Interventions" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Modalities" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_Modalities" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_PaymentMethods" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PhoneNumbers" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Number" TEXT NOT NULL,
    "RoleOfNumber" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "PK_PhoneNumbers" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalFields" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "FieldId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalFields" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalForecasts" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "ForecastId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalForecasts" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalInterventions" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "InterventionId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalInterventions" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalModalities" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "ModalityId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalModalities" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalPaymentMethods" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "PaymentMethodId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalPaymentMethods" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProfessionalSpecialties" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "SpecialtyId" INTEGER NOT NULL,

    CONSTRAINT "PK_ProfessionalSpecialties" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Professionals" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "PK_Professionals" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RestDays" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "DayOfWeek" INTEGER NOT NULL,

    CONSTRAINT "PK_RestDays" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Schedules" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "ScheduleStart" TIMESTAMPTZ(6) NOT NULL,
    "ScheduleEnd" TIMESTAMPTZ(6) NOT NULL,
    "RestStart" TIMESTAMPTZ(6) NOT NULL,
    "RestEnd" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_Schedules" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SpecialDays" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "Date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_SpecialDays" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SpecialSchedules" (
    "Id" SERIAL NOT NULL,
    "SpecialDayId" INTEGER NOT NULL,
    "ScheduleStart" TIMESTAMPTZ(6) NOT NULL,
    "ScheduleEnd" TIMESTAMPTZ(6) NOT NULL,
    "RestStart" TIMESTAMPTZ(6) NOT NULL,
    "RestEnd" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_SpecialSchedules" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Specialties" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "PK_Specialties" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Studies" (
    "Id" SERIAL NOT NULL,
    "ProfessionalId" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,

    CONSTRAINT "PK_Studies" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Users" (
    "Id" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "ImageURL" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Rut" TEXT NOT NULL,
    "BirthDate" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WhatsAppNumbers" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Number" TEXT NOT NULL,
    "RoleOfNumber" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "PK_WhatsAppNumbers" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "IX_Appointments_ProfessionalId" ON "Appointments"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_Appointments_UserId" ON "Appointments"("UserId");

-- CreateIndex
CREATE INDEX "IX_PhoneNumbers_UserId" ON "PhoneNumbers"("UserId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalFields_FieldId" ON "ProfessionalFields"("FieldId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalFields_ProfessionalId" ON "ProfessionalFields"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalForecasts_ForecastId" ON "ProfessionalForecasts"("ForecastId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalForecasts_ProfessionalId" ON "ProfessionalForecasts"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalInterventions_InterventionId" ON "ProfessionalInterventions"("InterventionId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalInterventions_ProfessionalId" ON "ProfessionalInterventions"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalModalities_ModalityId" ON "ProfessionalModalities"("ModalityId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalModalities_ProfessionalId" ON "ProfessionalModalities"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalPaymentMethods_PaymentMethodId" ON "ProfessionalPaymentMethods"("PaymentMethodId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalPaymentMethods_ProfessionalId" ON "ProfessionalPaymentMethods"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalSpecialties_ProfessionalId" ON "ProfessionalSpecialties"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_ProfessionalSpecialties_SpecialtyId" ON "ProfessionalSpecialties"("SpecialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Professionals_UserId" ON "Professionals"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "IX_RestDays_DayOfWeek" ON "RestDays"("DayOfWeek");

-- CreateIndex
CREATE INDEX "IX_RestDays_ProfessionalId" ON "RestDays"("ProfessionalId");

-- CreateIndex
CREATE INDEX "IX_Schedules_ProfessionalId" ON "Schedules"("ProfessionalId");

-- CreateIndex
CREATE UNIQUE INDEX "IX_SpecialDays_Date" ON "SpecialDays"("Date");

-- CreateIndex
CREATE INDEX "IX_SpecialDays_ProfessionalId" ON "SpecialDays"("ProfessionalId");

-- CreateIndex
CREATE UNIQUE INDEX "IX_SpecialSchedules_SpecialDayId" ON "SpecialSchedules"("SpecialDayId");

-- CreateIndex
CREATE INDEX "IX_Studies_ProfessionalId" ON "Studies"("ProfessionalId");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Users_Email" ON "Users"("Email");

-- CreateIndex
CREATE INDEX "IX_WhatsAppNumbers_UserId" ON "WhatsAppNumbers"("UserId");

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "FK_Appointments_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "FK_Appointments_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PhoneNumbers" ADD CONSTRAINT "FK_PhoneNumbers_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalFields" ADD CONSTRAINT "FK_ProfessionalFields_Fields_FieldId" FOREIGN KEY ("FieldId") REFERENCES "Fields"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalFields" ADD CONSTRAINT "FK_ProfessionalFields_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalForecasts" ADD CONSTRAINT "FK_ProfessionalForecasts_Forecasts_ForecastId" FOREIGN KEY ("ForecastId") REFERENCES "Forecasts"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalForecasts" ADD CONSTRAINT "FK_ProfessionalForecasts_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalInterventions" ADD CONSTRAINT "FK_ProfessionalInterventions_Interventions_InterventionId" FOREIGN KEY ("InterventionId") REFERENCES "Interventions"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalInterventions" ADD CONSTRAINT "FK_ProfessionalInterventions_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalModalities" ADD CONSTRAINT "FK_ProfessionalModalities_Modalities_ModalityId" FOREIGN KEY ("ModalityId") REFERENCES "Modalities"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalModalities" ADD CONSTRAINT "FK_ProfessionalModalities_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalPaymentMethods" ADD CONSTRAINT "FK_ProfessionalPaymentMethods_PaymentMethods_PaymentMethodId" FOREIGN KEY ("PaymentMethodId") REFERENCES "PaymentMethods"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalPaymentMethods" ADD CONSTRAINT "FK_ProfessionalPaymentMethods_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialties" ADD CONSTRAINT "FK_ProfessionalSpecialties_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialties" ADD CONSTRAINT "FK_ProfessionalSpecialties_Specialties_SpecialtyId" FOREIGN KEY ("SpecialtyId") REFERENCES "Specialties"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Professionals" ADD CONSTRAINT "FK_Professionals_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RestDays" ADD CONSTRAINT "FK_RestDays_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "FK_Schedules_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpecialDays" ADD CONSTRAINT "FK_SpecialDays_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpecialSchedules" ADD CONSTRAINT "FK_SpecialSchedules_SpecialDays_SpecialDayId" FOREIGN KEY ("SpecialDayId") REFERENCES "SpecialDays"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Studies" ADD CONSTRAINT "FK_Studies_Professionals_ProfessionalId" FOREIGN KEY ("ProfessionalId") REFERENCES "Professionals"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WhatsAppNumbers" ADD CONSTRAINT "FK_WhatsAppNumbers_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;
