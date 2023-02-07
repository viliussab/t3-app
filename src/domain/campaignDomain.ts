import { Campaign } from "@prisma/client";
import dateFns from "../front/imports/dateFns";
import { SideCampaignDto } from "../types/dto/campaignDtos";

const getCustomerThatOccupiesSide = (side : SideCampaignDto, from: Date, to: Date) => {
    const campaigns = side.billboardSideInCampaigns.flatMap(x => x.campaign);

    const campaign = campaigns.find(x => isCampaignInPeriod(x, from, to));

    return campaign;
}

const isCampaignInPeriod = (campaign: Campaign, from: Date, to: Date) => {
    const interval = {
      start: campaign.periodStart,
      end: campaign.periodEnd,
    }
    return dateFns.isWithinInterval(from, interval) || dateFns.isWithinInterval(to, interval);
}


const campaignDomain = {
    isCampaignInPeriod,
    getCustomerThatOccupiesSide
}

export default campaignDomain;