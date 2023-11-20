/*
  Warnings:

  - Added the required column `mark` to the `user_subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_subject" ADD COLUMN     "mark" DOUBLE PRECISION NOT NULL;
