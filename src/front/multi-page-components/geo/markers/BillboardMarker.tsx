import { Marker, Popup } from "react-leaflet";
import BillboardCard from "../../billboard/BillboardCard";
import React from "react";
import { BillboardDto } from "../../../../types/dto/BillboardDtos.schema";

type BillboardMarkerProps = {
    billboard: BillboardDto,
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
