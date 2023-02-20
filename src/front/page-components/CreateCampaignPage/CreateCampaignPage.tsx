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
    },
  });

  const [periodStart, periodEnd] = form.watch(["periodStart", "periodEnd"]);

  const calculated = campaignMapper.calculateDerivatives(form.watch());

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
                    <Form.Field
                      label="Kampanijos pavadinimas"
                      form={form}
                      fieldName="name"
                      muiProps={{
                        required: true,
                      }}
                    />
                    <Form.Select
                      label="Klientas"
                      form={form}
                      fieldName="customerId"
                      options={optionsService.convertByFields(
                        customersQuery.data,
                        "id",
                        "name"
                      )}
                    />
                    <Form.DatePicker
                      form={form}
                      label="Data nuo"
                      fieldName="periodStart"
                      onChangeSuccess={(value) =>
                        form.setValue("periodEnd", value)
                      }
                    />
                    <Form.DatePicker
                      form={form}
                      label="Data iki"
                      fieldName="periodEnd"
                      datePickerProps={{
                        shouldDisableDate: (date) =>
                          periodStart.getDay() !== date.getDay(),
                      }}
                    />
                    {/* <DateFrom form={form} />
                    <DateTo form={form} /> */}
                    <Form.Field
                      label="Plokštumų kiekis"
                      form={form}
                      fieldName="sideAmount"
                      muiProps={{
                        required: true,
                        type: "number",
                      }}
                      valueAsNumber
                    />
                    <Form.Field
                      label="Taikoma nuolaida"
                      form={form}
                      fieldName="discountPercent"
                      muiProps={{
                        required: true,
                        type: "number",
                        InputProps: {
                          endAdornment: (
                            <Mui.InputAdornment position="end">
                              %
                            </Mui.InputAdornment>
                          ),
                        },
                      }}
                      valueAsNumber
                    />
                    <Mui.FormControlLabel
                      control={
                        <Mui.Checkbox
                          defaultChecked
                          {...form.register("requiresPrinting")}
                        />
                      }
                      label="Reikia spausdinti"
                    />
                    <SubmitButton
                      isSubmitting={campaignCreateCommand.isLoading}
                    >
                      Kurti naują
                    </SubmitButton>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <div className="mb-4 text-center text-xl font-semibold">
                Apskaičiuota sąmata
              </div>
              <div className="flex flex-col justify-end gap-1">
                <EstimatePart
                  title="Spaudos kiekis"
                  value={`${calculated.pressUnits} vnt.`}
                />
                <EstimatePart
                  title="Savaičių kiekis"
                  value={`${calculated.weekCount}`}
                />
                <EstimatePart
                  title="Periodas (savaitėms)"
                  value={calculated.weekPeriod}
                />
                <EstimatePart
                  title="Plokštumos kaina su nuolaida"
                  value={`${calculated.stopPriceDiscounted} €`}
                />
                <EstimatePart
                  title="Reklamos paslaugos"
                  value={`${calculated.sideTotalPrice} €`}
                />
                <EstimatePart
                  title="Spaudos kaina"
                  value={`${calculated.pressUnitsPrice} €`}
                />
                <EstimatePart
                  title="Neplaninio nukabinimo kaina"
                  value={`${calculated.unplannedPrice} €`}
                />
                <EstimatePart
                  title="Suma"
                  value={`${calculated.totalPriceNoVat} €`}
                />
                <div className="font-bold">
                  <EstimatePart
                    title="Suma su PVM"
                    value={`${calculated.totalPriceVat} €`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </Layout>
  );
};

type EstimatePartProps = {
  title: string;
  value: string;
};

const EstimatePart = ({ title, value }: EstimatePartProps) => (
  <div className="flex justify-between">
    <div className="text-left" style={{ width: "60%" }}>
      {title}
    </div>
    <div style={{ width: "5%" }} />
    <div className="text-right" style={{ width: "35%" }}>
      {value}
    </div>
  </div>
);

export default CreateCampaignPage;
