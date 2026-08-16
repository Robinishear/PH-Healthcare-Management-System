-- CreateTable
CREATE TABLE "NewModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewModel_pkey" PRIMARY KEY ("id")
);
