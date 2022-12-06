import dynamic from "next/dynamic";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { Area } from "@prisma/client";
import { BillboardCreate } from "../../../types/command/billboard.schema";
import Form from "../../components/form";
const CreateMarkerMap = dynamic(() => import("../../multi-page-components/geo/maps/CreateMarkerMap"), {ssr: false});

type CoordinateFieldsProps = {
    form: UseFormReturn<BillboardCreate>,
    areas: Area[] | undefined,
}

const CoordinatesSection = (props : CoordinateFieldsProps) => {

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
  
  return (
    <div className="w-96 pt-0 m-4">
      <div className="flex ">
        <div className="pr-4">
          <Form.Field
            label="Platuma"
            form={form}
            fieldName="latitude"
            muiProps={{
              disabled: !selectedArea,
              InputLabelProps: { shrink: !!(selectedArea || latitude) }
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
              InputLabelProps: { shrink: !!(selectedArea || longitude) }
            }}
          />
        </div>
      </div>
  
      <div className="mt-4 w-96 h-96">
        {selectedArea ? (
          <CreateMarkerMap
            mapSW={[selectedArea.southWestLat, selectedArea.southWestLong]}
            mapNE={[selectedArea.northEastLat, selectedArea.northEastLong]}
            marker={[latitude, longitude]}
            onMarkerChange={(marker) => {setCoordinates(marker[0], marker[1]);}}
            draggable
          />)
          : (<div className="bg-gray-200 w-full h-full"></div>)}
      </div>
    </div>
  );
};

export default CoordinatesSection;
