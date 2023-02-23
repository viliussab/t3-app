import { Customer } from "@prisma/client";
import React from "react";
import optionsService from "../../../services/options";
import { CampaignCU } from "../../../types/command/campaign.schema";
import Form from "../../components/form";
import Mui from "../../imports/Mui";
import RHF from "../../imports/RHF";

type Props = {
  form: RHF.UseFormReturn<CampaignCU>;
  customerOptions: Customer[];
  children?: React.ReactNode;
};

const CampaignCUFormFields = (props: Props) => {
  const { form, customerOptions, children } = props;

  const [periodStart] = form.watch(["periodStart"]);

  return (
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
            customerOptions,
            "id",
            "name"
          )}
        />
        <Form.DatePicker
          form={form}
          label="Data nuo"
          fieldName="periodStart"
          onChangeSuccess={(value) => form.setValue("periodEnd", value)}
        />
        <Form.DatePicker
          form={form}
          label="Data iki"
          fieldName="periodEnd"
          datePickerProps={{
            minDate: periodStart,
            disabled: !periodStart,
            shouldDisableDate: (date) => periodStart.getDay() !== date.getDay(),
          }}
        />
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
                <Mui.InputAdornment position="end">%</Mui.InputAdornment>
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
        {children}
      </div>
    </div>
  );
};

export default CampaignCUFormFields;
