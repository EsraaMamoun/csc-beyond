-- CreateEnum
CREATE TYPE "os" AS ENUM ('ios', 'android', 'browser');

-- CreateEnum
CREATE TYPE "language" AS ENUM ('ar', 'en');

-- CreateTable
CREATE TABLE "device" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "language" "language" NOT NULL,
    "os" "os" NOT NULL,
    "ip" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
