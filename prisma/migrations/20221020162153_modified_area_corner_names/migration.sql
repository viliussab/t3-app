/*
  Warnings:

  - You are about to drop the column `northWestCorner_latitude` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `northWestCorner_longitude` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `southEastCorner_latitude` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `southEastCorner_longitude` on the `Area` table. All the data in the column will be lost.
  - Added the required column `northEastLat` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `northEastLong` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `southWestLat` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `southwestLong` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "northWestCorner_latitude",
DROP COLUMN "northWestCorner_longitude",
DROP COLUMN "southEastCorner_latitude",
DROP COLUMN "southEastCorner_longitude",
ADD COLUMN     "northEastLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "northEastLong" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "southWestLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "southwestLong" DOUBLE PRECISION NOT NULL;
