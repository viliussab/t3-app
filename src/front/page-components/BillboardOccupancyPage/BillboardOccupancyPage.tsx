import { CampaignStatus } from "@prisma/client";
import React from "react";
import campaignDomain from "../../../domain/campaignDomain";
import dateService from "../../../services/dateService";
import { SideCampaignDto } from "../../../types/dto/campaignDtos";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import { trpc } from "../../../utils/trpc";
import Layout from "../../components/Layout";
import dateFns from "../../imports/dateFns";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";

export default function BillboardOccupancyPage() {
  const [filters, setFilters] = React.useState<BillboardFilterObj>({
    allowedSides: [],
    illumination: BooleanFilters.Both,
    license: BooleanFilters.Both,
    search: "",
  });

  console.log("filters", filters);

  const sideNamesQuery = trpc.useQuery(["billboard.getDistinctSideTypes"], {
    onSuccess: (data) => {
      setFilters({ ...filters, allowedSides: data });
    },
  });

  const sidesQuery = trpc.useQuery(
    ["billboard.getSideOccupancy", { ...filters }],
    { enabled: !sideNamesQuery.isLoading }
  );

  const onFilterChange = (
    fieldName: keyof BillboardFilterObj,
    newValue: BillboardFilterObj[keyof BillboardFilterObj]
  ) => {
    setFilters({ ...filters, [fieldName]: newValue });
  };

  if (sideNamesQuery.isLoading) {
    return <>Loading...</>;
  }

  const sides = sidesQuery.data!;

  const startDate = dateService.getCurrentCampaignDay();
  const endDate = dateFns.addWeeks(startDate, 12);

  const difference = dateFns.differenceInWeeks(endDate, startDate);
  const differenceEnumerable = Array.from(new Array(difference), (_, i) => i);

  return (
    <Layout>
      <div className="mt-4 p-4">
        <div className="sticky top-0 z-10 mt-4 bg-white">
          <div className="mt-4 flex justify-center">
            <BillboardFilters
              sideNames={sideNamesQuery.data || []}
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
        </div>
        {!sidesQuery.isLoading && (
          <table className="border-collapse">
            <thead>
              <tr>
                <th />
                {differenceEnumerable.map((offset) => (
                  <th className="" style={{ minWidth: "200px" }}>
                    <DateRangeCell startDate={startDate} offset={offset} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sides?.map((side) => (
                <tr className="">
                  <th className="border-collapse whitespace-nowrap border-2 bg-gray-100 p-2 text-xs uppercase text-gray-700">
                    {`${side.title}`}
                  </th>
                  {differenceEnumerable.map((offset) => (
                    <BillboardOccupancyCell
                      startDate={startDate}
                      offset={offset}
                      side={side}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

type SideOccupancyCellProps = {
  startDate: Date;
  offset: number;
  side: SideCampaignDto;
};

const BillboardOccupancyCell = ({
  startDate,
  offset,
  side,
}: SideOccupancyCellProps) => {
  const from = dateFns.addWeeks(startDate, offset);
  const to = dateFns.addDays(from, 6);

  const campaign = campaignDomain.getCustomerThatOccupiesSide(side, from, to);

  const config = (() => {
    if (!campaign) {
      return {
        color: "green",
        text: "",
      };
    }

    const occupier = campaign.name;

    if (campaign.status !== "FULLFILED") {
      return {
        color: "gray",
        text: occupier,
      };
    }

    return {
      color: "red",
      text: occupier,
    };
  })();

  if (!campaign) {
    return (
      <td className="border-collapse border-2 border-green-300 bg-green-200 text-center">
        <div className="whitespace-nowrap p-1 text-lg font-medium uppercase text-green-700"></div>
      </td>
    );
  }

  const occupierName = `${campaign.name} / ${campaign.customer.name}`;

  return (
    <td
      className={`border-collapse border-2 border-${config.color}-300 bg-${config.color}-200 text-center`}
    >
      <div className={`whitespace-nowrap p-1  text-${config.color}-700`}>
        <div className="text-sm font-semibold">
          <span className="uppercase">{config.text}</span>
        </div>
      </div>
    </td>
  );
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
