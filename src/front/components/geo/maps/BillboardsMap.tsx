import { MapContainer, TileLayer } from "react-leaflet";  
import { LatLngTuple } from "leaflet";
import React from "react";
import { Billboard, BillboardSide, BillboardType } from "@prisma/client";
import BillboardMarker from "../markers/BillboardMarker";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

type MapProps = {
    mapSW: LatLngTuple,
    mapNE: LatLngTuple,

    billboards: (Billboard & {
        type: BillboardType;
        sides: BillboardSide[];
    })[],
}
 
const BillboardsMap = (props : MapProps) => {
  const {
    mapSW: southWest,
    mapNE: northEast,
    billboards
  } = props;
  
  return (
    <MapContainer
      style={{height: "100%", width: "100%"}}
      attributionControl={false}
      bounds={[southWest, northEast]}
      dragging={false}
    > 
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {billboards.map(billboard => (
        <BillboardMarker
          billboard={billboard}
          key={billboard.id} />
      ))}
    </MapContainer>
  );
};

export default BillboardsMap;
