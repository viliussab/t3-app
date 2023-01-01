import { Campaign, Customer } from "@prisma/client";

export type CampaignDto = Campaign & {
    customer: Customer;
}
