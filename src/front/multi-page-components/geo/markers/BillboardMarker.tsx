import { Marker, Popup } from "react-leaflet";
import BillboardCard from "../../billboard/BillboardCard";
import React from "react";
import { BillboardDto } from "../../../../types/dto/BillboardDtos";
import * as Mui from "@mui/material";
import styles from "./BillboardMarker.module.css";

type BillboardMarkerProps = {
    billboard: BillboardDto,
  }

const BillboardMarker = ({billboard}: BillboardMarkerProps) => {

  const [open, setOpen] = React.useState(false);

  console.log("open", open);


  return (
    <>
      <Marker
        position={[billboard.latitude, billboard.longitude]} 
        eventHandlers={{
          click: (() => setOpen(prev => !prev)),
          mouseover: (event) => event.target.openPopup()
        }}>
        <Popup className={styles.Popup}>
          <div className="text-lg">
            {billboard.address}
          </div>
          <div className="text-gray-500 mb-2">
            {`${billboard.sides.length} stotelės`}
          </div>
          {billboard.sides.map(side => (
            <div key={side.id} className="text-center">
              {side.title}
            </div>
          ))}
        </Popup>
      </Marker>
      <Mui.Dialog open={open} onClose={() => setOpen(false)}>
        <BillboardCard 
          billboard={billboard}
        />
      </Mui.Dialog>
    </>
  );
};

export default BillboardMarker;
