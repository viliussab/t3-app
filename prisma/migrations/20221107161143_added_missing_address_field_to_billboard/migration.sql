/*
  Warnings:

  - Added the required column `address` to the `Billboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billboard" ADD COLUMN     "address" TEXT NOT NULL;
