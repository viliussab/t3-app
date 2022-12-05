import { Billboard, BillboardSide, BillboardType } from "@prisma/client";
import { Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

type BillboardMarkerProps = {
    billboard: Billboard & {
        type: BillboardType;
        sides: BillboardSide[];
    },
  }

const BillboardMarker = ({billboard}: BillboardMarkerProps) => {

  return (
    <Marker
      draggable={false}
      position={[billboard.latitude, billboard.longitude]} />
  );
};

export default BillboardMarker;
