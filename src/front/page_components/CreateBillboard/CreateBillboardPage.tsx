import React from "react";
import type { NextPage } from "next";
import { trpc } from "../../../utils/trpc";
import * as RHF from "react-hook-form";
import { BillboardCreate, billboardCreateSchema } from "../../../types/billboard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as NextRouter from "next/router";
import Components from "../../components";
import CoordinatesSection from "./CoordinatesSection";
import * as Mui from "@mui/material";
import Form from "../../components/form";
import optionsService from "./../../../services/options";

const CreateBillboardPage: NextPage = () => {
  const router = NextRouter.useRouter();
  const areaQuery = trpc.useQuery(["area.getAll"]);
  const typesQuery = trpc.useQuery(["billboardType.getAll"]);

  const billboardCreate = trpc.useMutation(
    ["billboard.create"], 
    {
      onSuccess: () => {
        router.push("/billboards");
      }
    });

  const form = RHF.useForm<BillboardCreate>({
    resolver: zodResolver(billboardCreateSchema),
    defaultValues: {
      areaId: ""
    }
  });

  const submitBillboard = (values : BillboardCreate) => {
    billboardCreate.mutate(values);
  };

  if (areaQuery.isLoading && typesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Components.Layout>
      <div className="flex justify-center">
        <Components.Paper className="m-4 p-4 bg-gray-50">
          <div className="text-center text-xl font-semibold">
              Kurti objektą
          </div>
          <form onSubmit={(e) => { 
            form.handleSubmit(submitBillboard)(e);
          }}>
            <div className="flex justify-center">
              <div className="w-64 pt-0 m-4 space-y-3">
                <Form.Field
                  label='Kodas'
                  form={form}
                  fieldName="serialCode"
                  muiProps={{required: true}}
                />
                <Form.Select
                  form={form}
                  label="Miestas"
                  fieldName="areaId"
                  options={optionsService.convert(areaQuery.data, "id", "locationName")}
                />
                <Form.Select
                  form={form}
                  label="Tipas"
                  fieldName="typeId"
                  options={optionsService.convert(typesQuery.data, "id", "name")}
                />
                <Form.Field
                  label='Adresas'
                  form={form}
                  fieldName="address"
                  muiProps={{required: true}}
                />
                <Form.Field
                  label='Pavadinimas'
                  form={form}
                  fieldName="name"
                  muiProps={{required: true}}
                />
                <Form.Field
                  label='Pusė'
                  form={form}
                  fieldName="sideName"
                  muiProps={{required: true}}
                />
                <FullNameField control={form.control}/>
                <Mui.FormControlLabel
                  control={
                    <Mui.Checkbox defaultChecked {...form.register("isLicensed")}/>
                  }
                  label="Licenzijuota" />
                <Mui.FormControlLabel
                  control={
                    <Mui.Checkbox defaultChecked 
                      {...form.register("isIlluminated")}/>
                  }
                  label="Apšvietimas" />
              </div>
              <CoordinatesSection form={form} areas={areaQuery.data}/>
            </div>
            <div className="flex justify-center">
              <Components.SubmitButton isSubmitting={billboardCreate.isLoading}>Kurti naują</Components.SubmitButton>
            </div>
          </form>
        </Components.Paper>
      </div>
    </Components.Layout>
  );
};

type FullNameFieldProps = {
  control: RHF.Control<BillboardCreate>,
}

const FullNameField = (props : FullNameFieldProps) => {
  const [name, side] = RHF.useWatch({ control: props.control, name: ["name", "sideName"] });

  return <Mui.TextField
    label="Pilnas pavadinimas"
    disabled
    fullWidth
    variant="filled"
    value={(name || side)
      ? `${name} ${side}`
      : "" }
    InputLabelProps={{ shrink: !!(name || side) }}
  />;
};
  
export default CreateBillboardPage;
