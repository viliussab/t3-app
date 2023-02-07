import { NextPage } from "next/types";
import React from "react";
import { CampaignDto, CampaignListDto } from "../../../types/dto/campaignDtos";
import Layout from "../../components/Layout";
import Table, { ColumnConfig } from "../../components/Table";
import { trpc } from "./../../../utils/trpc";
import dateService from "./../../../services/dateService";
import ActionButton from "./../../components/ActionButton";
import Icons from "./../../components/Icons";
import Link from "next/link";
import CampaignStatusChip from "../../multi-page-components/campaign/CampaignStatusChip";

const CampaignPage : NextPage = () => {

  const campaignsQuery = trpc.useQuery(["campaign.getAll"]);

  const columns: ColumnConfig<CampaignListDto>[] = [
    {
      title: "Kampanijos pavadinimas",
      renderCell: (campaign) => <>{campaign.name}</>,
      key: "campaignName"
    },
    {
      title: "Klientas",
      renderCell: (campaign) => <>{campaign.customer.name}</>,
      key: "clientName"
    },
    {
      title: "Laiko periodas",
      renderCell: (campaign) => <>{
        `${dateService.formatToYearWeek(campaign.periodStart)}
                 - 
                 ${dateService.formatToYearWeek(campaign.periodEnd)}`}</>,
      key: "period"
    },
    {
      title: "Plokštumų kiekis",
      renderCell: (campaign) => <>{campaign.sideAmount}</>,
      key: "orderedAmount"
    },
    {
      title: "Būsėna",
      renderCell: (campaign) => <CampaignStatusChip status={campaign.status} />,
      key: "status"
    },
    {
      title: "Veiksmai",
      renderCell: (campaign) => (
        <div className="flex gap-2">
          <Link href={`/campaigns/select/${campaign.id}`}>
            <ActionButton onClick={() => {}} color="altAction">
          Išrinkti stoteles
            </ActionButton>
          </Link>
          <ActionButton onClick={() => {}} color="pdf">
            <div className="flex gap-2">
            Gauti sąskaitos faktūrą
              <Icons.Pdf size={20}/>
            </div>
          </ActionButton>


          <ActionButton onClick={() => {}} color="danger">
          Atšaukti užsakymą
          </ActionButton>
        </div>
      ),
      key: "actions"
    }
  ];

  return (
    <Layout>
      <div className="mt-4 flex justify-center">
        <Table
          columns={columns}
          keySelector={(campaign) => campaign.id}
          data={campaignsQuery.data ? campaignsQuery.data : []}
        />
      </div>
    </Layout>
  );
};

export default CampaignPage;
