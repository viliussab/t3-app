import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { UseQueryResult } from "react-query";
import dateService from "../../../../services/dateService";
import {
  CampaignCU,
  campaignSchema,
} from "../../../../types/command/campaign.schema";
import { trpc } from "../../../../utils/trpc";
import SubmitButton from "../../../components/form/SubmitButton";
import dateFns from "../../../imports/dateFns";
import RHF from "../../../imports/RHF";
import CampaignCUFormFields from "../../../multi-page-components/campaign/CampaignCUFormFields";
import CampaignOrderEstimate from "../../../multi-page-components/campaign/CampaignOrderEstimate";

type Props = {
  form: RHF.UseFormReturn<CampaignCU>;
  campaignQuery: UseQueryResult<Campaign>;
};

const UpdateCampaignSection = ({ form, campaignQuery }: Props) => {
  const router = useRouter();
  const campaignCreateCommand = trpc.useMutation(["campaign.create"], {
    onSuccess: () => {
      router.push("/campaigns");
    },
  });

  const onSubmit = (values: CampaignCU) => {
    campaignCreateCommand.mutateAsync(values);
  };

  const customersQuery = trpc.useQuery(["customer.getAll"]);

  if (customersQuery.isLoading || campaignQuery.isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex gap-4">
      <div>
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
                <SubmitButton isSubmitting={campaignCreateCommand.isLoading}>
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
  );
};

export default UpdateCampaignSection;
