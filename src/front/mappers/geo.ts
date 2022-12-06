import { Area, Billboard } from "@prisma/client";
import { LatLngBoundsExpression, LatLngTuple } from "leaflet";

const getCornersfromArea = (area: Area) => {
  const southWestPoint = getPoint(area.southWestLat, area.southWestLong);
  const northEastPoint = getPoint(area.northEastLat, area.northEastLong);

  return [southWestPoint, northEastPoint] as LatLngBoundsExpression; 
};

const getPointFromBillboard = (billboard: Billboard) => {
  const point = getPoint(billboard.latitude, billboard.longitude);

  return point;
};

const getPoint = (latitude: number, longitude: number) => {
  const point = [latitude, longitude] as LatLngTuple;

  return point;
};

const geoMapper = {
  getCornersfromArea,
  getPointFromBillboard,
  getPoint
};

export default geoMapper;
