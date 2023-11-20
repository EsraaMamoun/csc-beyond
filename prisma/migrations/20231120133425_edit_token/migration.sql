/*
  Warnings:

  - You are about to drop the column `tokenType` on the `token` table. All the data in the column will be lost.
  - Added the required column `token_type` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "tokenType",
ADD COLUMN     "token_type" "tokenType" NOT NULL;
