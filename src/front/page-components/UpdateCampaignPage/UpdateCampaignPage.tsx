import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { UseQueryResult } from "react-query";
import dateService from "../../../services/dateService";
import {
  CampaignCU,
  campaignSchema,
} from "../../../types/command/campaign.schema";
import { trpc } from "../../../utils/trpc";
import Layout from "../../components/Layout";
import Paper from "../../components/Paper";
import dateFns from "../../imports/dateFns";
import Mui from "../../imports/Mui";
import UpdateCampaignSection from "./private/UpdateCampaignSection";

const UpdateCampaignPage = () => {
  const [tab, setTab] = React.useState(0);

  const router = useRouter();

  const nextWeekStart = dateFns.addWeeks(
    dateService.getCurrentCampaignDay(),
    1
  );

  const { id } = router.query;
  const campaignQuery = trpc.useQuery(
    ["campaign.getById", { id: id as string }],
    {
      onSuccess(data) {
        form.reset(data!);
      },
    }
  );

  const form = useForm<CampaignCU>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      periodStart: nextWeekStart,
      periodEnd: nextWeekStart,
      customerId: "",
    },
  });

  return (
    <Layout>
      <div className="m-4 flex justify-center">
        <Paper className="m-4 bg-gray-50 p-4">
          <Mui.Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Mui.Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Mui.Tab label="Item One" />
              <Mui.Tab label="Item Two" />
              <Mui.Tab label="Item Three" />
            </Mui.Tabs>
          </Mui.Box>
          <TabPanel value={tab} index={0}>
            <UpdateCampaignSection
              form={form}
              campaignQuery={campaignQuery as UseQueryResult<Campaign>}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={tab} index={2}>
            Item Three
          </TabPanel>
          <div>yee</div>
        </Paper>
      </div>
    </Layout>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>{value === index ? children : <></>}</div>
  );
}

export default UpdateCampaignPage;
