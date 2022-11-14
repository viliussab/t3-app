import React from "react";
import Layout from "../../front/components/Layout";
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Control, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { BillboardCreate, billboardCreateSchema } from "../../types/billboard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../front/third-party/Input";
import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Area } from "@prisma/client";
import { useRouter } from "next/router";

const MarkerMap = dynamic(() => import("../../front/components/no-ssr/CreateMarkerMap"), {ssr: false});

const ObjectsCreate: NextPage = () => {
  const router = useRouter();
  const areaQuery = trpc.useQuery(["area.getAll"]);
  const typesQuery = trpc.useQuery(["billboardType.getAll"]);

  const billboardCreate = trpc.useMutation(
    ["billboard.create"], 
    {
      onSuccess(data) {
        console.log("success!", data);
        router.push("/billboards");
      }
    });

  const form = useForm<BillboardCreate>({
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
    <Layout>
      <form onSubmit={(e) => { form.handleSubmit(submitBillboard)(e);
      }}>
        <div className="flex justify-around m-4">
          <div className="w-64 pt-0 m-4 space-y-3">
            <Input.TextField
              label='Kodas'
              fullWidth
              required
              variant="standard"
              error={!!errors["serialCode"]}
              helperText={errors["serialCode"] ? errors["serialCode"].message : ""}
              {...form.register("serialCode")}
            />
            <Input.FormControl variant="standard" fullWidth>
              <Input.Label id="demo-simple-select-standard-label">Miestas</Input.Label>
              <Input.Select
                fullWidth
                required
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
            <Input.FormControl variant="standard" fullWidth>
              <Input.Label id="demo-simple-select-standard-label">Tipas</Input.Label>
              <Input.Select
                fullWidth
                required
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                {...form.register("typeId")}
              >
                <Input.SelectItem value={""}>
                  <em>Nepasirinkta</em>
                </Input.SelectItem>
                {typesQuery.data?.map(type => 
                  <Input.SelectItem key={type.id} value={type.id}>{type.name}</Input.SelectItem>
                )}
              </Input.Select>
            </Input.FormControl>
            <Input.TextField
              label='Adresas'
              fullWidth
              required
              variant="standard"
              error={!!errors["address"]}
              helperText={errors["address"] ? errors["address"].message : ""}
              {...form.register("address")}
            />
            <Input.TextField
              label='Pavadinimas'
              fullWidth
              required
              variant="standard"
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...form.register("name")}
            />
            <Input.TextField
              label='Pusė'
              fullWidth
              required
              variant="standard"
              error={!!errors["sideName"]}
              helperText={errors["sideName"] ? errors["sideName"].message : ""}
              {...form.register("sideName")}
            />
            <FullNameField control={form.control}/>
            <Input.FormControlLabel
              control={
                <Input.Checkbox defaultChecked {...form.register("isLicensed")}/>
              }
              label="Licenzijuota" />
            <Input.FormControlLabel
              control={
                <Input.Checkbox defaultChecked 
                  {...form.register("isIlluminated")}/>
              }
              label="Apšvietimas" />
            <div>
              <button type="submit">Submit</button>
            </div>
          </div>
          <CoordinateFields form={form} areas={areaQuery.data}/>
        </div>
      </form>
    </Layout>
  );
};

type CoordinateFieldsProps = {
  form: UseFormReturn<BillboardCreate>,
  areas: Area[] | undefined,
}

const CoordinateFields = (props : CoordinateFieldsProps) => {

  const {form, areas} = props;

  const [areaId, latitude, longitude] = useWatch({
    control: form.control,
    name: ["areaId", "latitude", "longitude"]
  });

  const selectedArea = areas?.find(a => a.id === areaId);

  const setCoordinates = useCallback((lat: number, long: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", long);
  }, [form]);

  useEffect(() => {
    if (selectedArea) {
      const lat = (selectedArea.southWestLat + selectedArea.northEastLat) / 2;
      const long = (selectedArea.southWestLong + selectedArea.northEastLong) / 2;
      
      setCoordinates(lat, long);
    } 
  }, [selectedArea, setCoordinates]);

  const { errors } = form.formState;

  return (
    <div className="w-96 pt-0 m-4">
      <div className="flex ">
        <div className="pr-4">
          <Input.TextField
            label='Platuma'
            disabled={!selectedArea}
            fullWidth
            required
            variant="standard"
            error={!!errors["latitude"]}
            helperText={errors["latitude"] ? errors["latitude"].message : ""}
            {...form.register("latitude", {valueAsNumber: true})}
            InputLabelProps={{ shrink: !!(selectedArea || latitude) }}
          />
        </div>
        <div className="pl-4">
          <Input.TextField
            label='Ilguma'
            disabled={!selectedArea}
            fullWidth
            required
            variant="standard"
            error={!!errors["longitude"]}
            helperText={errors["longitude"] ? errors["longitude"].message : ""}
            {...form.register("longitude", {valueAsNumber: true})}
            InputLabelProps={{ shrink: !!(selectedArea || longitude) }}
          />
        </div>
      </div>
      {selectedArea && (
        <div className="mt-4 w-96 h-96">
          <MarkerMap
            mapSW={[selectedArea.southWestLat, selectedArea.southWestLong]}
            mapNE={[selectedArea.northEastLat, selectedArea.northEastLong]}
            marker={[latitude, longitude]}
            onMarkerChange={(marker) => {setCoordinates(marker[0], marker[1]);}}
            draggable
          />
        </div>
      )}
    </div>
  );
};

type FullNameFieldProps = {
  control: Control<BillboardCreate>,
}

const FullNameField = (props : FullNameFieldProps) => {
  const [name, side] = useWatch({ control: props.control, name: ["name", "sideName"] });

  return <Input.TextField
    label="Pilnas pavadinimas"
    disabled
    fullWidth
    variant="standard"
    value={(name || side)
      ? `${name} ${side}`
      : "" }
    InputLabelProps={{ shrink: !!(name || side) }}
  />;
};
  
export default ObjectsCreate;
