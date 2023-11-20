/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_account_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_account_id_fkey";

-- AlterTable
ALTER TABLE "user_subject" ALTER COLUMN "mark" DROP NOT NULL;

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "user";
