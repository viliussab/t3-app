/*
  Warnings:

  - You are about to drop the column `name` on the `Billboard` table. All the data in the column will be lost.
  - Added the required column `title` to the `BillboardSide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billboard" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "BillboardSide" ADD COLUMN     "title" TEXT NOT NULL;
