/*
  Warnings:

  - You are about to drop the column `title` on the `BillboardSide` table. All the data in the column will be lost.
  - Added the required column `isIlluminated` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLicensed` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialCode` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `BillboardSide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billboard" ADD COLUMN     "isIlluminated" BOOLEAN NOT NULL,
ADD COLUMN     "isLicensed" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "serialCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BillboardSide" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
