import React from "react";
import Icons from "../../components/Icons";
import { BillboardDto } from "../../../types/dto/BillboardDtos";
import Image from "next/image";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";

type BillboardCardProps = {
    billboard: BillboardDto,
}

const BillboardCard = (props : BillboardCardProps) => {
  const { billboard } = props;

  const googleDriveToImageSource = (value: string) => {

    console.log('value', value, value.lastIndexOf("/"))

    const a = value.substring(0, value.lastIndexOf("/")) + "/preview";

    console.log('res', a);
    return a;
  }

  return (
    <div className="">
      <div className="m-2 text-xl text-center">
        {billboard.address}
      </div>
      <div className="flex justify-end mb-2">
      <ActionButton onClick={() => {}}>
                    Redaguoti objektą
                  </ActionButton>
        </div> 
        {billboard.sides.map(side => (
          <>
          <div key={side.id} className="flex gap-2">
            <div className="p-4 pt-1 flex justify-between flex-col" style={{width: "200px"}}>
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
  
            {side.googlePhotoUrl && (
              <a href={side.googlePhotoUrl}>
                <div style={{width: "200px", height: "150px"}}>
                  <iframe src={googleDriveToImageSource(side.googlePhotoUrl)} allow="autoplay" width="200" height="150"/>
                </div>
                </a>
            )}
          </div>
          <Divider />
          </>
        ))}
      </div>

  );
};

export default BillboardCard;
