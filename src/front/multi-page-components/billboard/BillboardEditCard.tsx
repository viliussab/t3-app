import React from "react";
import { BillboardDto } from "../../../types/dto/BillboardDtos";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";
import GoogleSideImage from "./../../components/GoogleSideImage";

type BillboardCardProps = {
    billboard: BillboardDto,
}

const BillboardEditCard = (props : BillboardCardProps) => {
  const { billboard } = props;

  return (
    <div className="mb-2">
      <div className="m-2 text-xl text-center">
        {`${billboard.serialCode}. ${billboard.address}`}
      </div>
      <div className="flex justify-end mb-2">
        <ActionButton onClick={() => {}}>
                    Redaguoti objektą
        </ActionButton>
      </div> 
      {billboard.sides.map(side => (
        <>
          <div key={side.id} className="flex gap-2">
            <div className="p-4 pt-1 flex justify-between flex-col" style={{width: "300px"}}>
              <div>
                <div className="text-lg">{`${side.title}`}</div>
                <div className="text-base text-gray-600 text-bold">{`${side.sideType} pusė`}</div>
              </div>
              <div>
                <ActionButton onClick={() => {}}>
                    Redaguoti stotelę
                </ActionButton>
              </div>
            </div>
            <GoogleSideImage
              width={200}
              height={150}
              googleDriveUrl={side.googlePhotoUrl}
            />
          </div>
          <Divider />
        </>
      ))}
    </div>

  );
};

export default BillboardEditCard;
