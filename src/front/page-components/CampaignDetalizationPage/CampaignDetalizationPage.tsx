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
import BillboardsSelected from "../../multi-page-components/billboard/BillboardsSelected";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import React from "react";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import ActionButton from "../../components/ActionButton";

const CampaignDetalizationPage : NextPage = () => {
  const [filters, setFilters] = React.useState<BillboardFilterObj>({
    allowedSides: [],
    illumination: BooleanFilters.Both,
    license: BooleanFilters.Both,
    search: ""
  });

  const nextWeekStart = dateFns.addWeeks(dateService.getCurrentCampaignDay(), 1);

  const form = useForm<CampaignCreate>({
    resolver: zodResolver(campaignCreateSchema),
    defaultValues: {
      periodStart: nextWeekStart,
      periodEnd: nextWeekStart,
      selectedBillboardIds: []
    }
  });

  const selects = React.useMemo(
    () => ({sideIds: form.watch("selectedBillboardIds")}),
    [form]);

  const customersQuery = trpc.useQuery(["customer.getAll"]);
  const filteredQuery = trpc.useQuery(["billboard.getFiltered", filters]);
  const selectedQuery = trpc.useQuery(["billboard.getBySideIds", selects]);

  if (customersQuery.isLoading && filteredQuery.isLoading && selectedQuery.isLoading) {
    return <>Loading...</>;
  }

  return (
    <Layout>
      <div className="flex justify-center m-4">
        <div className="w-56 pt-0 m-4 mt-0 space-y-3">
          <Form.Field
            label="Kampanijos pavadinimas"
            form={form}
            fieldName="campaignName"
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
        </div>
        <BillboardsSelected selected={selectedQuery.data} />
      </div>
      <div className="flex justify-center">
        <ActionButton
          onClick={() => { console.log("click");}}
        >
          Pasirinkti žemėlapyje
        </ActionButton>
        <ActionButton
          onClick={() => { console.log("click");}}
        >
          Pasirinkti sąraše
        </ActionButton>
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

export default CampaignDetalizationPage;
