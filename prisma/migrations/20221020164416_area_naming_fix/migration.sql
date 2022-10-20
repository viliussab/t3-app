/*
  Warnings:

  - You are about to drop the column `southwestLong` on the `Area` table. All the data in the column will be lost.
  - Added the required column `southWestLong` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "southwestLong",
ADD COLUMN     "southWestLong" DOUBLE PRECISION NOT NULL;
