import {
  Billboard,
  BillboardSide,
  BillboardSideInCampaign,
  Campaign,
  Customer,
} from "@prisma/client";

export type CampaignDto = Campaign & {
  billboardSideInCampaigns: (BillboardSideInCampaign & {
    billboardSide: BillboardSide;
  })[];
};

export type CampaignListDto = Campaign & {
  customer: Customer;
};

export type CustomerCampaignDto = Customer & {
  campaigns: CampaignDto[];
};

export type SideCampaignDto = BillboardSide & {
  billboard: Billboard;
  billboardSideInCampaigns: (BillboardSideInCampaign & {
    campaign: Campaign & {
      customer: Customer;
    };
  })[];
};
