/*
  Warnings:

  - You are about to drop the `AreaBillboard` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `areaId` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Billboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AreaBillboard" DROP CONSTRAINT "AreaBillboard_areaId_fkey";

-- DropForeignKey
ALTER TABLE "AreaBillboard" DROP CONSTRAINT "AreaBillboard_billboardId_fkey";

-- AlterTable
ALTER TABLE "Billboard" ADD COLUMN     "areaId" TEXT NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AreaBillboard";

-- CreateTable
CREATE TABLE "BillboardType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BillboardType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Billboard" ADD CONSTRAINT "Billboard_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BillboardType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billboard" ADD CONSTRAINT "Billboard_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;
