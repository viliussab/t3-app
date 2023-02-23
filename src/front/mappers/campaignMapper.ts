import dateService from "../../services/dateService";
import dateFns from "../imports/dateFns";
import CONSTANTS from "../../constants";
import { CampaignDto, CustomerCampaignDto } from "../../types/dto/campaignDtos";

export type CampaignEsmitationProps = {
  periodStart: Date;
  periodEnd: Date;
  discountPercent: number;
  sideAmount: number;
  requiresPrinting: boolean;
};

const flattenSides = (campaigns: CampaignDto[]) => {
  return campaigns.map((campaign) => ({
    ...campaign,
    billboardSides: campaign.billboardSideInCampaigns.map(
      (joinTable) => joinTable.billboardSide
    ),
  }));
};

const customerFlattenSides = (customers: CustomerCampaignDto[]) => {
  return customers.map((customer) => ({
    ...customer,
    campaigns: flattenSides(customer.campaigns),
  }));
};

const calculateEstimate = (val: CampaignEsmitationProps) => {
  const weekPeriod =
    !!val.periodStart && !!val.periodEnd
      ? dateService.formatPeriodShort(val.periodStart, val.periodEnd)
      : "-";

  const weekCount =
    !!val.periodStart && !!val.periodEnd
      ? dateFns.differenceInWeeks(val.periodEnd, val.periodStart) + 1
      : 0;

  const stopPriceDiscounted = val.discountPercent
    ? CONSTANTS.SIDE_PRICE * ((100 - val.discountPercent) / 100)
    : CONSTANTS.SIDE_PRICE;

  const pressUnits =
    !!val.sideAmount && !!val.requiresPrinting
      ? Math.round(val.sideAmount * CONSTANTS.PRESS_RATIO)
      : 0;

  const pressUnitsPrice = pressUnits * CONSTANTS.PRESS_PRICE;

  const unplannedPrice =
    !!val.sideAmount && dateService.isNotCampaignDay(val.periodStart)
      ? CONSTANTS.UNPLANNED_COST_PER_SIDE * val.sideAmount
      : 0;

  const sideTotalPrice =
    (val.sideAmount || 0) * weekCount * stopPriceDiscounted;

  const totalPriceNoVat = pressUnitsPrice + unplannedPrice + sideTotalPrice;

  const totalPriceVat = totalPriceNoVat * (1 + CONSTANTS.VAT);

  return {
    weekCount,
    weekPeriod,
    isUnplanned: dateService.isNotCampaignDay(val.periodStart),
    stopPriceDiscounted: stopPriceDiscounted.toFixed(2),
    sideTotalPrice: sideTotalPrice.toFixed(2),
    pressUnitsPrice: pressUnitsPrice.toFixed(2),
    pressUnits,
    unplannedPrice: unplannedPrice.toFixed(2),
    totalPriceNoVat: totalPriceNoVat.toFixed(2),
    totalPriceVat: totalPriceVat.toFixed(2),
  };
};

const campaignMapper = {
  calculateEstimate,
  customerFlattenSides,
};

export default campaignMapper;
