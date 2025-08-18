-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filling" (
    "id" SERIAL NOT NULL,
    "truckNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fuelType" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "requestedQty" DOUBLE PRECISION NOT NULL,
    "actualQty" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Filling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualCashEntries" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stationId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "hasAlert" BOOLEAN NOT NULL DEFAULT false,
    "alert" TEXT,

    CONSTRAINT "ManualCashEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nozzle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sold" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Nozzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_cache" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Nozzle_name_key" ON "Nozzle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "system_cache_key_key" ON "system_cache"("key");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
