import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LatLngTuple } from "leaflet";

type Props = {
  southWest: LatLngTuple,
  northEast: LatLngTuple,
}

const StaticAreaMap = (props : Props) => {
  const {
    southWest,
    northEast
  } = props;

  return (
    <MapContainer
      scrollWheelZoom={false}
      style={{height: "100%", width: "100%"}}
      attributionControl={false}
      bounds={[southWest, northEast]}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
    > 
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default StaticAreaMap;
