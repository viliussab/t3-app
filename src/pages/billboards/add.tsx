import Layout from "../../front/components/Layout";
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import { Control, useForm, useWatch } from "react-hook-form";
import { BillboardCreate, billboardCreateSchema } from "../../types/billboard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../front/third-party/input/index";
import { useEffect } from "react";
import { getValue } from "@mui/system";

const ObjectsCreate: NextPage = () => {

  const areaQuery = trpc.useQuery(["area.getAll"]);
  const typesQuery = trpc.useQuery(["billboardType.getAll"]);

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
    console.log("Submitting");
    console.log(values, "values");
  };


  if (areaQuery.isLoading && typesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const { errors } = form.formState;

  console.log(errors, "errors");

  

  return (
    <Layout>
      <form onSubmit={(e) => { form.handleSubmit(submitBillboard)(e);
      }}>
        <div className="flex justify-center m-4">
          <div className="w-52 pt-0 p-4 space-y-3">
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

type FullNameFieldProps = {
  control: Control,
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
