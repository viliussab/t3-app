import { Marker, Popup } from "react-leaflet";
import React from "react";
import { BillboardDto } from "../../../../types/dto/BillboardDtos";
import * as Mui from "@mui/material";
import styles from "./BillboardMarker.module.css";

type BillboardMarkerProps = {
  billboard: BillboardDto;
  renderDialog: (billboard: BillboardDto) => React.ReactNode;
};

const BillboardMarker = ({ billboard, renderDialog }: BillboardMarkerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Marker
        position={[billboard.latitude, billboard.longitude]}
        eventHandlers={{
          click: () => setOpen((prev) => !prev),
          mouseover: (event) => event.target.openPopup(),
        }}
      >
        <Popup className={styles.Popup}>
          <div className="text-lg">
            {`${billboard.serialCode} ${billboard.address}`}
          </div>
          <div className="mb-2 text-gray-500">
            {`${billboard.sides.length} stotelės`}
          </div>
          {billboard.sides.map((side) => (
            <div key={side.id} className="text-center">
              {side.title}
            </div>
          ))}
        </Popup>
      </Marker>
      <Mui.Dialog open={open} onClose={() => setOpen(false)}>
        {renderDialog(billboard)}
      </Mui.Dialog>
    </>
  );
};

export default BillboardMarker;
