import { MapContainer, TileLayer } from "react-leaflet";  
import React from "react";
import { Area, Billboard, BillboardSide, BillboardType } from "@prisma/client";
import BillboardMarker from "../markers/BillboardMarker";
import MapFrame from "./MapFrame";
import geoMapper from "../../../mappers/geo";


type MapProps = {
    area: Area,
    billboards: (Billboard & {
        type: BillboardType;
        sides: BillboardSide[];
    })[],
}
 
const BillboardsMap = (props : MapProps) => {
  const {
    area,
    billboards
  } = props;

  return (
    <MapFrame
      bounds={geoMapper.getCornersfromArea(area)}
    >
      {billboards.map(billboard => (
        <BillboardMarker
          billboard={billboard}
          key={billboard.id} />
      ))}
    </MapFrame>
  );
};

export default BillboardsMap;
