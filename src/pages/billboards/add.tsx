import Layout from "../../front/components/Layout";
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, useWatch } from "react-hook-form";
import { BillboardCreate, billboardCreateSchema } from "../../types/billboard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../front/third-party/input/index";
import { useEffect, useMemo } from "react";
import { LatLngTuple } from "leaflet";
import { Area } from "@prisma/client";

const ObjectsCreate: NextPage = () => {

  const areaQuery = trpc.useQuery(["area.getAll"]);

  const form = useForm<BillboardCreate>({
    resolver: zodResolver(billboardCreateSchema),
    defaultValues: {
      areaId: ""
    }
  });

  const id = form.getValues("areaId");
  const selectedArea = areaQuery?.data?.find(a => a.id === id);

  useEffect(() => {
    if (selectedArea) {
      console.log("input changed!");
    }
  }, [selectedArea]);

  const submitBillboard = (values : BillboardCreate) => {
    console.log(values, "values");
  };

  if (areaQuery.isLoading) {
    return <div>Loading...</div>;
  }



  const { errors } = form.formState;

  console.log("selectedArea", selectedArea);

  return (
    <Layout>
      <form onSubmit={form.handleSubmit(submitBillboard)}>
        <div className="flex justify-evenly m-4">
          <div className="w-64 pt-0 p-4">
            <Input.FormControl variant="standard" fullWidth>
              <Input.Label id="demo-simple-select-standard-label">Miestas</Input.Label>
              <Input.Select
                fullWidth
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                {...form.register("areaId")}
                value={form.watch("areaId")}
              >
                <Input.SelectItem value={""}>
                  <em>Nepasirinkta</em>
                </Input.SelectItem>
                {areaQuery.data?.map(area => 
                  <Input.SelectItem key={area.id} value={area.id}>{area.locationName}</Input.SelectItem>
                )}
              </Input.Select>
            </Input.FormControl>
            <div>
              <button type="submit">Submit</button>
            </div>
          </div>
          <div className="w-96 pt-0 p-4">
            <div className="flex">
              <div className="mr-4">
                <Input.TextField
                  label='Platuma'
                  disabled={!selectedArea}
                  fullWidth
                  required
                  variant="standard"
                  error={!!errors["latitude"]}
                  type="number"
                  helperText={errors["latitude"] ? errors["latitude"].message : ""}
                  {...form.register("latitude", {valueAsNumber: true})}
                />
              </div>
              <div>
                <Input.TextField
                  label='Ilguma'
                  disabled={!selectedArea}
                  fullWidth
                  required
                  variant="standard"
                  error={!!errors["longitude"]}
                  type="number"
                  helperText={errors["longitude"] ? errors["longitude"].message : ""}
                  {...form.register("longitude", {valueAsNumber: true})}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};
  
export default ObjectsCreate;
