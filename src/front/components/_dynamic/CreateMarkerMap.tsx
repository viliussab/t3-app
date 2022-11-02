import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LatLngTuple, Marker as MarkerType } from "leaflet";
import React, { SetStateAction, useRef, useMemo, useCallback } from "react";

type Props = {
  mapSW: LatLngTuple,
  mapNE: LatLngTuple,

  marker: LatLngTuple,
  setMarker: React.Dispatch<SetStateAction<LatLngTuple>>

  draggable: boolean,
}

const CreateMarkerMap = (props : Props) => {
  const {
    mapSW: southWest,
    mapNE: northEast
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
      <DraggableMarker
        coordinates={props.marker}
        setCoordinates={props.setMarker}
        draggable={props.draggable}
      />
    </MapContainer>
  );
};

export default CreateMarkerMap;

type MarkerProps = {
    coordinates: LatLngTuple,
    setCoordinates: React.Dispatch<SetStateAction<LatLngTuple>>
  
    draggable: boolean,
  }

const DraggableMarker = (props: MarkerProps) => {
  const {coordinates, setCoordinates, draggable} = props;

  const markerRef = useRef<MarkerType>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const coords = marker.getLatLng();
          setCoordinates([coords.lat, coords.lng]);
        }
      }
    }),
    [setCoordinates],
  );

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={coordinates}
      ref={markerRef}>
    </Marker>
  );
};

