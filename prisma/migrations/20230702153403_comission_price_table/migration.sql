-- CreateTable
CREATE TABLE "comissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "comissions_pkey" PRIMARY KEY ("id")
);
