-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PREPARED', 'SELECTED', 'CONFIRMED');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'PREPARED';
