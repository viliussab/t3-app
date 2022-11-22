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

  const { errors } = form.formState;

  return (
    <Components.Layout>
      <div className="flex justify-center">
        <Components.ContentContainer className="m-4 p-4 bg-gray-50">
          <div className="text-center text-xl font-semibold">
              Kurti objektą
          </div>
          <form onSubmit={(e) => { 
            form.handleSubmit(submitBillboard)(e);
          }}>

            <div className="flex justify-center">
              <div className="w-64 pt-0 m-4 space-y-3">
                <Mui.TextField
                  label='Kodas'
                  fullWidth
                  required
                  variant="filled"
                  error={!!errors["serialCode"]}
                  helperText={errors["serialCode"] ? errors["serialCode"].message : ""}
                  {...form.register("serialCode")}
                />
                <Mui.FormControl variant="filled" fullWidth>
                  <Mui.InputLabel id="demo-simple-select-standard-label">Miestas</Mui.InputLabel>
                  <Mui.Select
                    fullWidth
                    required
                    defaultValue=""
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    {...form.register("areaId")}
                    value={form.watch("areaId")}
                  >
                    <Mui.MenuItem value={""}>
                      <em>Nepasirinkta</em>
                    </Mui.MenuItem>
                    {areaQuery.data?.map(area => 
                      <Mui.MenuItem key={area.id} value={area.id}>{area.locationName}</Mui.MenuItem>
                    )}
                  </Mui.Select>
                </Mui.FormControl>
                <Mui.FormControl variant="filled" fullWidth>
                  <Mui.InputLabel id="demo-simple-select-standard-label">Tipas</Mui.InputLabel>
                  <Mui.Select
                    fullWidth
                    required
                    defaultValue=""
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    {...form.register("typeId")}
                  >
                    <Mui.MenuItem value={""}>
                      <em>Nepasirinkta</em>
                    </Mui.MenuItem>
                    {typesQuery.data?.map(type => 
                      <Mui.MenuItem key={type.id} value={type.id}>{type.name}</Mui.MenuItem>
                    )}
                  </Mui.Select>
                </Mui.FormControl>
                <Mui.TextField
                  label='Adresas'
                  fullWidth
                  required
                  variant="filled"
                  error={!!errors["address"]}
                  helperText={errors["address"] ? errors["address"].message : ""}
                  {...form.register("address")}
                />
                <Mui.TextField
                  label='Pavadinimas'
                  fullWidth
                  required
                  variant="filled"
                  error={!!errors["name"]}
                  helperText={errors["name"] ? errors["name"].message : ""}
                  {...form.register("name")}
                />
                <Mui.TextField
                  label='Pusė'
                  fullWidth
                  required
                  variant="filled"
                  error={!!errors["sideName"]}
                  helperText={errors["sideName"] ? errors["sideName"].message : ""}
                  {...form.register("sideName")}
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
        </Components.ContentContainer>
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
