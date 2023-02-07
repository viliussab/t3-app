import { Campaign } from "@prisma/client";
import campaignDomain from "../../../domain/campaignDomain";
import dateService from "../../../services/dateService";
import { CustomerCampaignDto } from "../../../types/dto/campaignDtos";
import { trpc } from "../../../utils/trpc";
import Layout from "../../components/Layout";
import dateFns from "../../imports/dateFns";
import campaignMapper from "../../mappers/campaignMapper";
import CampaignStatusChip from "../../multi-page-components/campaign/CampaignStatusChip";

const CampaignsSummaryPage = () => {

  const customerCampaignsQuery = trpc.useQuery(["campaign.getAllByCustomer"]);

  if (customerCampaignsQuery.isLoading) {
    return <>Loading</>;
  }

  const customerCampaigns = campaignMapper.customerFlattenSides(customerCampaignsQuery.data!);

  const allCampaigns = customerCampaigns.flatMap(cust => cust.campaigns);

  const startDate = dateService.getCurrentCampaignDay();
  const endDate = dateFns.max(allCampaigns?.map((campaign) => campaign.periodEnd) ?? []);

  const difference = dateFns.differenceInWeeks(endDate, startDate);
  const differenceEnumerable = Array.from(new Array(difference), (_, i) => i);

  console.log('diff', differenceEnumerable);

  return (
    <Layout>
    <div className="p-4 mt-4">
        <table className="border-collapse">
          <thead>
            <tr>
              <th />
            {differenceEnumerable.map(offset => (
              <th className="" style={{minWidth: "200px"}}>
                <DateRangeCell startDate={startDate} offset={offset} />
              </th>
            ))}
            </tr>

          </thead>
          <tbody>
              {customerCampaigns.map((customer) => (
                <tr className="">
                  <th className="pl-2 pr-2 text-xs border-2 border-collapse text-gray-700 uppercase bg-gray-100">
                    {`${customer.name}`}
                  </th>
                  {differenceEnumerable.map(offset => (
                    <td className="border-collapse bg-gray-200" style={{verticalAlign: "top"}}>
                      <CampaignCell startDate={startDate} offset={offset} customer={customer} />
                    </td>
                  ))}
                </tr>
                ))}
          </tbody>
        </table>
    </div>
    </Layout>
  );
};

type CampaignCellProps = {
  startDate: Date, offset: number, customer: CustomerCampaignDto
}

const CampaignCell = ({startDate, offset, customer} : CampaignCellProps) => {

  const from = dateFns.addWeeks(startDate, offset);
  const to = dateFns.addDays(from, 6);

  const eligibleCampaigns = customer.campaigns.filter(cmpgn => campaignDomain.isCampaignInPeriod(cmpgn, from, to));

  if (eligibleCampaigns.length === 0) {
    return null;
  }

  return (
  <div className="bg-blue-200 pt-1 pb-1 mt-1 mb-1 flex justify-between">
    <div className="flex-grow">
    {eligibleCampaigns.map(campaign => (
    <div className=" even:bg-blue-100 odd:bg-blue-50 p-2 flex gap-4 justify-between">
      <div className="flex-grow flex flex-col gap-2 justify-center">
        <div className="whitespace-nowrap text-center uppercase text-blue-700 text-sm font-bold">{campaign.name}</div>
        <div className="flex justify-center opacity-80">
            <CampaignStatusChip status={campaign.status}/>
          </div>

        </div>
        <div className="flex justify-center align-middle text-2xl  m-auto">
          <div>
            {campaign.sideAmount}
            </div>
          </div>
          </div>
    ))}
    </div>
    <div>

    </div>
    <div className="w-12 mr-1 ml-1 flex justify-center align-middle text-4xl m-auto">
          <div>
            {eligibleCampaigns.reduce((sum, campaign) => sum + campaign.sideAmount, 0)}
            </div>
          </div>
    </div>)
}

type DateRangeCellProps = {
  startDate: Date, offset: number
}

const DateRangeCell = ({startDate, offset} : DateRangeCellProps) => {

  const cellStart = dateFns.addWeeks(startDate, offset);
  const cellEnd = dateFns.addDays(cellStart, 6);

  return <>
    {dateService.formatRangeMonthly(cellStart, cellEnd)}
  </>
}

export default CampaignsSummaryPage;
