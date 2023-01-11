/*
  Warnings:

  - You are about to drop the column `name` on the `BillboardSide` table. All the data in the column will be lost.
  - Added the required column `sideType` to the `BillboardSide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillboardSide" DROP COLUMN "name",
ADD COLUMN     "sideType" TEXT NOT NULL;
