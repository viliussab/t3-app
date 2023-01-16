import React from "react";
import { BillboardDto, BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";

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

  const googleDriveToImageSource = (value: string) => {

    console.log("value", value, value.lastIndexOf("/"));

    const a = value.substring(0, value.lastIndexOf("/")) + "/preview";

    console.log("res", a);
    return a;
  };

  return (
    <div className="">
      <div className="m-2 text-xl text-center">
        {billboard.address}
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
                {
                  selectedKeys.some(k => k === side.id) ? (
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

export default BillboardSelectCard;
