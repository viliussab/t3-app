import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";  
import { LatLngTuple, Marker as MarkerType } from "leaflet";
import React, { useRef, useMemo } from "react";
import MapBoundsUpdater from "../providers/MapBoundsUpdater";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

type Props = {
  mapSW: LatLngTuple,
  mapNE: LatLngTuple,

  marker: LatLngTuple,
  onMarkerChange: (marker: LatLngTuple) => void,

  draggable: boolean,
}

const CreateMarkerMap = (props : Props) => {
  const {
    mapSW: southWest,
    mapNE: northEast
  } = props;

  return (
    <MapContainer
      style={{height: "100%", width: "100%"}}
      attributionControl={false}
      bounds={[southWest, northEast]}
      
    > 
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsUpdater
        mapSW={southWest}
        mapNE={northEast}
      />
      <DraggableMarker
        coordinates={props.marker}
        onCoordinateChange={props.onMarkerChange}
        draggable={props.draggable}
      />
    </MapContainer>
  );
};

export default CreateMarkerMap;

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

