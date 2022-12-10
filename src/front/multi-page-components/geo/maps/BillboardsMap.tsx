import React from "react";
import { Area } from "@prisma/client";
import BillboardMarker from "../markers/BillboardMarker";
import MapFrame from "./MapFrame";
import geoMapper from "../../../mappers/geo";
import { BillboardDto } from "../../../../types/dto/BillboardDtos.schema";

type MapProps = {
    area: Area,
    billboards: BillboardDto[],
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
