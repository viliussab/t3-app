import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LatLngBoundsExpression, Map as LeafletMap } from "leaflet";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";

const OPEN_STREET_MAP_PROVIDER = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

type MapProps = {
  bounds: LatLngBoundsExpression,
  mapProps?: React.ForwardRefExoticComponent<MapContainerProps & React.RefAttributes<LeafletMap>>,
  children?: React.ReactNode
}

const MapFrame = (props : MapProps) => {
  const {
    bounds,
    children,
    mapProps
  } = props;
    
  return (
    <MapContainer
      style={{height: "100%", width: "100%"}}
      bounds={bounds}
      attributionControl={false}
      {...mapProps}
    > 
      <TileLayer
        url={OPEN_STREET_MAP_PROVIDER}
      />
      {children}
    </MapContainer>
  );
};

export default MapFrame;
