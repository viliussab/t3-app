import React from "react";
import { BillboardDto, BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";
import GoogleSideImage from "../../components/GoogleSideImage";
import { BillboardSide } from "@prisma/client";

type ComponentProps = {
    billboard: BillboardDto,
    onSideSelect: (billboard: BillboardUniqueSideDto) => void,
    selectedKeys: string[],
}

const BillboardSelectCard = (props : ComponentProps) => {
  const { 
    billboard,
    onSideSelect,
    selectedKeys
  } = props;

  const getIsSelected = (side : BillboardSide) => selectedKeys.some(k => k === side.id);

  return (
    <div className="pb-2">
      <div className="m-2 text-xl text-center">
        {`${billboard.serialCode}. ${billboard.address}`}
      </div> 
      {billboard.sides.map(side => (
        <>
          <div key={side.id} className="flex gap-2">
            <div className="p-4 pt-1 flex justify-between flex-col" style={{width: "300px"}}>
              <div>
                <div className="text-lg">{`${side.title}`}</div>
                <div className="text-base text-gray-600 text-bold">{`${side.sideType} pusė`}</div>
                {getIsSelected(side) && (
                  <div className="text-green-500 italic text-bold">Pasirinkta</div>
                )}
              </div>
              <div>
                {
                  getIsSelected(side) ? (
                    <ActionButton onClick={() => onSideSelect({...billboard, side})} color="danger">
                        Atmesti stotelę
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => onSideSelect({...billboard, side})} color="positive">
                        Pasirinkti stotelę
                    </ActionButton>
                  )
                }
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

export default BillboardSelectCard;
