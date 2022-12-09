import { Marker, useMapEvents } from "react-leaflet";  
import { LatLngTuple, Marker as MarkerType } from "leaflet";
import React, { useRef, useMemo } from "react";
import MapBoundsUpdater from "../operators/MapBoundsUpdater";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import MapFrame from "./MapFrame";

type Props = {
  mapSW: LatLngTuple,
  mapNE: LatLngTuple,

  marker: LatLngTuple,
  onMarkerChange: (marker: LatLngTuple) => void,

  draggable: boolean,
}

const MarkerCreateMap = (props : Props) => {
  const {
    mapSW,
    mapNE
  } = props;

  return (
    <MapFrame
      bounds={[mapSW, mapNE]}
    >
      <MapBoundsUpdater
        mapSW={mapSW}
        mapNE={mapNE}
      />
      <DraggableMarker
        coordinates={props.marker}
        onCoordinateChange={props.onMarkerChange}
        draggable={props.draggable}
      />
    </MapFrame>
  );
};

export default MarkerCreateMap;

type MarkerProps = {
    coordinates: LatLngTuple,
    onCoordinateChange: (coordinates: LatLngTuple) => void,
  
    draggable: boolean,
  }

const DraggableMarker = (props: MarkerProps) => {
  const {coordinates, onCoordinateChange, draggable} = props;

  useMapEvents({
    click (e) {
      onCoordinateChange([e.latlng.lat, e.latlng.lng]);
    }
  });

  const markerRef = useRef<MarkerType>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const coords = marker.getLatLng();
          onCoordinateChange([coords.lat, coords.lng]);
        }
      }
    }),
    [onCoordinateChange],
  );

  if (!coordinates[0] || !coordinates[1]) {
    return null;
  }

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={coordinates}
      ref={markerRef}>
    </Marker>
  );
};

