/*
  Warnings:

  - Added the required column `discountPercent` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodEnd` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiresPrinting` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sideAmount` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "discountPercent" INTEGER NOT NULL,
ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requiresPrinting" BOOLEAN NOT NULL,
ADD COLUMN     "sideAmount" INTEGER NOT NULL;
