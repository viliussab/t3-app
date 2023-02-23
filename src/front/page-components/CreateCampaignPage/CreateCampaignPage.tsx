import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import {
  CampaignCU,
  campaignSchema,
} from "../../../types/command/campaign.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Mui from "@mui/material";
import * as dateFns from "date-fns";
import Form from "../../components/form";
import optionsService from "../../../services/options";
import dateService from "../../../services/dateService";
import React from "react";
import Paper from "../../components/Paper";
import SubmitButton from "../../components/form/SubmitButton";
import { useRouter } from "next/router";
import campaignMapper from "../../mappers/campaignMapper";
import CampaignCUFormFields from "../../multi-page-components/campaign/CampaignCUFormFields";
import CampaignOrderEstimate from "../../multi-page-components/campaign/CampaignOrderEstimate";

const CreateCampaignPage: NextPage = () => {
  const router = useRouter();
  const nextWeekStart = dateFns.addWeeks(
    dateService.getCurrentCampaignDay(),
    1
  );

  const form = useForm<CampaignCU>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      periodStart: nextWeekStart,
      periodEnd: nextWeekStart,
      customerId: "",
    },
  });

  const campaignCreateCommand = trpc.useMutation(["campaign.create"], {
    onSuccess: () => {
      router.push("/campaigns");
    },
  });

  const onSubmit = (values: CampaignCU) => {
    campaignCreateCommand.mutateAsync(values);
  };

  const customersQuery = trpc.useQuery(["customer.getAll"]);

  if (customersQuery.isLoading) {
    return <>Loading...</>;
  }

  return (
    <Layout>
      <div className="m-4 flex justify-center">
        <Paper className="m-4 bg-gray-50 p-4">
          <div className="flex gap-4">
            <div>
              <div className="text-center text-xl font-semibold">
                Kurti kampaniją
              </div>
              <form
                onSubmit={(e) => {
                  form.handleSubmit(onSubmit)(e);
                }}
              >
                <div className="flex justify-center">
                  <div className="m-4 w-64 space-y-3 pt-0">
                    <CampaignCUFormFields
                      form={form}
                      customerOptions={customersQuery.data || []}
                    >
                      <SubmitButton
                        isSubmitting={campaignCreateCommand.isLoading}
                      >
                        Kurti naują
                      </SubmitButton>
                    </CampaignCUFormFields>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <CampaignOrderEstimate campaign={form.watch()} />
            </div>
          </div>
        </Paper>
      </div>
    </Layout>
  );
};

export default CreateCampaignPage;
