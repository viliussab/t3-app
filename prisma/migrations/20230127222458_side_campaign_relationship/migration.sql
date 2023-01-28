-- CreateTable
CREATE TABLE "BillboardSideInCampaign" (
    "campaignId" TEXT NOT NULL,
    "billboardSideId" TEXT NOT NULL,

    CONSTRAINT "BillboardSideInCampaign_pkey" PRIMARY KEY ("campaignId","billboardSideId")
);

-- AddForeignKey
ALTER TABLE "BillboardSideInCampaign" ADD CONSTRAINT "BillboardSideInCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillboardSideInCampaign" ADD CONSTRAINT "BillboardSideInCampaign_billboardSideId_fkey" FOREIGN KEY ("billboardSideId") REFERENCES "BillboardSide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
