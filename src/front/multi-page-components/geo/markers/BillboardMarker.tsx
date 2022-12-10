import { Billboard, BillboardSide, BillboardType } from "@prisma/client";
import { Marker, Popup } from "react-leaflet";
import BillboardCard from "../../BillboardCard";
import React from "react";

type BillboardMarkerProps = {
    billboard: Billboard & {
        type: BillboardType;
        sides: BillboardSide[];
    },
  }

const BillboardMarker = ({billboard}: BillboardMarkerProps) => {

  return (
    <Marker
      position={[billboard.latitude, billboard.longitude]} >
      <Popup>
        <BillboardCard 
          billboard={billboard}
        />
      </Popup>
    </Marker>
  );
};

export default BillboardMarker;
