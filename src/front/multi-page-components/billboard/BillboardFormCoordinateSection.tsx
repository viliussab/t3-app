import React from "react";
import dynamic from "next/dynamic";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { Area } from "@prisma/client";
import { BillboardCU } from "../../../types/command/billboard.schema";
import Form from "../../components/form";

const CreateMarkerMap = dynamic(() => import("../geo/maps/CreateMarkerMap"), {
  ssr: false,
});

type Props = {
  form: UseFormReturn<BillboardCU>;
  areas: Area[] | undefined;
};

const BillboardFormCoordinateSection = (props: Props) => {
  const { form, areas } = props;

  const [areaId, latitude, longitude] = useWatch({
    control: form.control,
    name: ["areaId", "latitude", "longitude"],
  });

  const selectedArea = areas?.find((a) => a.id === areaId);

  const setCoordinates = useCallback(
    (lat: number, long: number) => {
      form.setValue("latitude", lat);
      form.setValue("longitude", long);
    },
    [form]
  );

  useEffect(() => {
    if (selectedArea) {
      const lat = (selectedArea.southWestLat + selectedArea.northEastLat) / 2;
      const long =
        (selectedArea.southWestLong + selectedArea.northEastLong) / 2;

      setCoordinates(lat, long);
    }
  }, [selectedArea, setCoordinates]);

  return (
    <div className="m-4 w-96 pt-0">
      <div className="flex ">
        <div className="pr-4">
          <Form.Field
            label="Platuma"
            form={form}
            fieldName="latitude"
            muiProps={{
              disabled: !selectedArea,
            }}
          />
        </div>
        <div className="">
          <Form.Field
            label="Ilguma"
            form={form}
            fieldName="longitude"
            muiProps={{
              disabled: !selectedArea,
            }}
          />
        </div>
      </div>
      <div className="mt-4 h-96 w-96">
        {selectedArea ? (
          <CreateMarkerMap
            mapSW={[selectedArea.southWestLat, selectedArea.southWestLong]}
            mapNE={[selectedArea.northEastLat, selectedArea.northEastLong]}
            marker={[latitude, longitude]}
            onMarkerChange={(marker) => {
              setCoordinates(marker[0], marker[1]);
            }}
            draggable
          />
        ) : (
          <div className="h-full w-full bg-gray-200"></div>
        )}
      </div>
    </div>
  );
};

export default BillboardFormCoordinateSection;
