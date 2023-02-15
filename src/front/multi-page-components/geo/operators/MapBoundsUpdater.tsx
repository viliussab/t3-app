import { useMap } from "react-leaflet";
import { LatLngTuple } from "leaflet";

type Props = {
  mapSW: LatLngTuple;
  mapNE: LatLngTuple;
};

const MapBoundsUpdater = (props: Props) => {
  const map = useMap();

  map.fitBounds([props.mapSW, props.mapNE]);

  return null;
};

export default MapBoundsUpdater;
