import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { CampaignCreate, campaignCreateSchema } from "../../../types/command/campaignCreate.schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import * as Mui from "@mui/material";
import * as dateFns from "date-fns";
import Form from "../../components/form";
import optionsService from "../../../services/options";
import dateService from "../../../services/dateService";
import React from "react";
import Paper from "../../components/Paper";
import SubmitButton from "../../components/form/SubmitButton";
import { useRouter } from "next/router";

const CreateCampaignPage : NextPage = () => {
  const router = useRouter();
  const nextWeekStart = dateFns.addWeeks(dateService.getCurrentCampaignDay(), 1);

  const form = useForm<CampaignCreate>({
    resolver: zodResolver(campaignCreateSchema),
    defaultValues: {
      periodStart: nextWeekStart,
      periodEnd: nextWeekStart
    }
  });

  const campaignCreateCommand = trpc.useMutation(
    ["campaign.create"],
    {
      onSuccess: () => {
        router.push("/billboards");
      }
    });

  const onSubmit = (values: CampaignCreate) => {
    campaignCreateCommand.mutateAsync(values);
  };

  const customersQuery = trpc.useQuery(["customer.getAll"]);

  if (customersQuery.isLoading) {
    return <>Loading...</>;
  }

  return (
    <Layout>
      <div className="flex justify-center m-4">
        <Paper className="m-4 p-4 bg-gray-50">
          <div className="text-center text-xl font-semibold">
              Kurti kampaniją
          </div>
          <form onSubmit={(e) => { 
            form.handleSubmit(onSubmit)(e);
          }}>
            <div className="flex justify-center">
              <div className="w-64 pt-0 m-4 space-y-3">
                <Form.Field
                  label="Kampanijos pavadinimas"
                  form={form}
                  fieldName="name"
                  muiProps={{
                    required: true
                  }}
                />
                <Form.Select 
                  label="Klientas"
                  form={form}
                  fieldName="customerId"
                  options={optionsService.convertByFields(customersQuery.data, "id", "name")}
                />
                <DateFrom form={form} />
                <DateTo form={form} />
                <Form.Field 
                  label="Plokštumų kiekis"
                  form={form}
                  fieldName="sideAmount"
                  muiProps={{
                    required: true,
                    type: "number"

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
                      )
                    }
                  }}
                  valueAsNumber
                />
                <Mui.FormControlLabel
                  control={
                    <Mui.Checkbox defaultChecked 
                      {...form.register("requiresPrinting")}/>
                  }
                  label="Reikia spausdinti" />
                <SubmitButton isSubmitting={campaignCreateCommand.isLoading}>Kurti naują</SubmitButton>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    </Layout>
  );
};

type DatePickerProps = {
  form: UseFormReturn<CampaignCreate>
}


const DateFrom = (props : DatePickerProps) => {
  const { form } = props;

  const [periodStart, periodEnd] = form.watch(["periodStart", "periodEnd"]);

  const onChange = (newPeriodStart: Date | null) => {
    if (!newPeriodStart) {
      return;
    }

    if (!periodEnd || newPeriodStart > periodEnd) {
      form.setValue("periodEnd", newPeriodStart);
    }

    form.setValue("periodStart", newPeriodStart);
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopDatePicker
      label="Data nuo"
      shouldDisableDate={dateService.isNotCampaignDay}
      minDate={new Date()}
      value={periodStart}
      onChange={onChange}
      renderInput={(props: Mui.TextFieldProps) => {
        return (
          <Mui.TextField 
            {...props}
            inputProps={{
              value: dateService.formatToYearWeek(periodStart),
              placeholder: undefined
            }}
            variant="filled"
            required
            fullWidth
            InputLabelProps={{ shrink: !!periodStart }}
          />);
      }}
    />
  </LocalizationProvider>;
};

const DateTo = (props : DatePickerProps) => {
  const { form } = props;

  const [periodStart, periodEnd] = form.watch(["periodStart", "periodEnd"]);

  const onChange = (newPeriodEnd: Date | null) => {
    if (!newPeriodEnd) {
      return;
    }

    form.setValue("periodEnd", newPeriodEnd);
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopDatePicker
      label="Iki"
      shouldDisableDate={dateService.isNotCampaignDay}
      minDate={periodStart}
      value={periodEnd}
      onChange={onChange}
      renderInput={(props: Mui.TextFieldProps) => {
        return (
          <Mui.TextField 
            {...props}
            inputProps={{value: dateService.formatToYearWeek(periodEnd)}}
            variant="filled"
            required
            fullWidth
            InputLabelProps={{ shrink: !!periodEnd }}
          />);
      }}
    />
  </LocalizationProvider>;
};

export default CreateCampaignPage;
