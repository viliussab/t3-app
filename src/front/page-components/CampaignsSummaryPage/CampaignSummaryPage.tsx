import { Campaign } from "@prisma/client";
import campaignDomain from "../../../domain/campaignDomain";
import dateService from "../../../services/dateService";
import {
  CampaignDto,
  CustomerCampaignDto,
} from "../../../types/dto/campaignDtos";
import lodash from "lodash";
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

  const customerCampaigns = campaignMapper.customerFlattenSides(
    customerCampaignsQuery.data!
  );

  const allCampaigns = customerCampaigns.flatMap((cust) => cust.campaigns);

  const startDate = dateService.getCurrentCampaignDay();
  const endDate = dateFns.max(
    allCampaigns?.map((campaign) => campaign.periodEnd) ?? []
  );

  const difference = dateFns.differenceInWeeks(endDate, startDate);
  const weekColumns = Array.from(new Array(difference), (_, i) => i);

  const getEligibleCampaignForEachPeriod = () => {
    const campaignsOfMatrix = weekColumns.map((diff) => {
      const from = dateFns.addWeeks(startDate, diff);
      const to = dateFns.addDays(from, 6);

      const campaignsOfRow = allCampaigns.filter((campaign) =>
        campaignDomain.isCampaignInPeriod(campaign, from, to)
      );

      return campaignsOfRow;
    });

    return campaignsOfMatrix;
  };

  const campaignsEachWeek = getEligibleCampaignForEachPeriod();
  const campaignsEachRow = lodash.unzip(campaignsEachWeek);
  const maxRowCount = Math.max(...campaignsEachWeek.map((x) => x.length));
  const rows = Array.from(new Array(maxRowCount), (_, i) => i);

  console.log("maxrow", maxRowCount);

  console.log("diff", weekColumns);

  const getCampaignFromMatrix = (column: number, row: number) => {
    const campaignsColumn = campaignsEachWeek[column];

    if (!campaignsColumn) {
      return undefined;
    }

    return campaignsColumn[row];
  };

  const getCellColor = (campaign: CampaignDto) => {
    if (campaign.status === "FULLFILED") {
      return "green";
    }

    return "gray";
  };

  console.log("rows", rows);

  return (
    <Layout>
      <div className="mt-4 p-4">
        <table className="border-collapse">
          <thead>
            <tr>
              <th />
              {weekColumns.map((offset) => (
                <th className="" style={{ minWidth: "200px" }}>
                  <DateRangeCell startDate={startDate} offset={offset} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowIndex) => (
              <>
                <CampaignRow
                  campaignColumns={campaignsEachRow[rowIndex]!}
                  weekColumns={weekColumns}
                />
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

type CampaignRowProps = {
  weekColumns: number[];
  campaignColumns: CampaignDto[];
};

const CampaignRow = ({ weekColumns, campaignColumns }: CampaignRowProps) => {
  const getCellColor = (campaign: CampaignDto | undefined) => {
    if (!campaign) {
      return "slate";
    }

    if (campaign?.status === "FULLFILED") {
      return "green";
    }

    return "gray";
  };

  return (
    <>
      <tr className="  ">
        <th className="border-collapse border-2 bg-orange-100 pl-2 pr-2 text-xs uppercase text-orange-700">
          Kampanija
        </th>

        {weekColumns.map((columnIndex) => (
          <td
            className={`border-collapse border-2 border-b-0 bg-${getCellColor(
              campaignColumns[columnIndex]
            )}-100 text-${getCellColor(campaignColumns[columnIndex])}-700 `}
          >
            {campaignColumns[columnIndex] && (
              <div>{campaignColumns[columnIndex]?.name}</div>
            )}
          </td>
        ))}
      </tr>
      <tr className="">
        <th className="border-collapse border-2 bg-gray-100 pl-2  pr-2 text-xs uppercase text-gray-700">
          Plokštumos
        </th>
        {weekColumns.map((columnIndex) => (
          <td
            className={`border-2 border-t-0 bg-${getCellColor(
              campaignColumns[columnIndex]
            )}-100 text-${getCellColor(
              campaignColumns[columnIndex]
            )}-700  text-right`}
          >
            {campaignColumns[columnIndex] && (
              <div>{campaignColumns[columnIndex]?.sideAmount}</div>
            )}
          </td>
        ))}
      </tr>
    </>
  );
};

type CampaignCellProps = {
  startDate: Date;
  offset: number;
  customer: CustomerCampaignDto;
};

type DateRangeCellProps = {
  startDate: Date;
  offset: number;
};

const DateRangeCell = ({ startDate, offset }: DateRangeCellProps) => {
  const cellStart = dateFns.addWeeks(startDate, offset);
  const cellEnd = dateFns.addDays(cellStart, 6);

  return <>{dateService.formatRangeMonthly(cellStart, cellEnd)}</>;
};

export default CampaignsSummaryPage;
