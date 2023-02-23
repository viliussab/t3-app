import { Area, BillboardType } from "@prisma/client";
import React from "react";
import optionsService from "../../../services/options";
import { BillboardCU } from "../../../types/command/billboard.schema";
import Form from "../../components/form";
import Mui from "../../imports/Mui";
import RHF from "../../imports/RHF";
import BillboardFormCoordinateSection from "./BillboardFormCoordinateSection";

type Props = {
  types: BillboardType[];
  areas: Area[];
  form: RHF.UseFormReturn<BillboardCU>;
};

const BillboardFormFields = (props: Props) => {
  const { types, areas, form } = props;

  return (
    <div className="flex justify-center">
      <div className="m-4 w-64 space-y-3 pt-0">
        <Form.Field
          label="Kodas"
          form={form}
          fieldName="serialCode"
          muiProps={{ required: true }}
        />
        <Form.Select
          form={form}
          label="Miestas"
          fieldName="areaId"
          options={optionsService.convertByFields(areas, "id", "locationName")}
        />
        <Form.Select
          form={form}
          label="Tipas"
          fieldName="typeId"
          options={optionsService.convertByFields(types, "id", "name")}
        />
        <Form.Field
          label="Adresas"
          form={form}
          fieldName="address"
          muiProps={{ required: true }}
        />
        <Mui.FormControlLabel
          control={
            <Mui.Checkbox defaultChecked {...form.register("isLicensed")} />
          }
          label="Licenzijuota"
        />
        <Mui.FormControlLabel
          control={
            <Mui.Checkbox defaultChecked {...form.register("isIlluminated")} />
          }
          label="Apšvietimas"
        />
      </div>
      <BillboardFormCoordinateSection form={form} areas={areas} />
    </div>
  );
};

export default BillboardFormFields;
