import React from "react";
import { BillboardDto, BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";
import { match } from "assert";
import Image from "next/image";

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


  const getImageIdWithNoise = (value: string) => {
    const driveOpenLink = /^https:\/\/drive.google.com\/open\?id=(.*)$/;
    const driveFileLink = /^https:\/\/drive.google.com\/file\/d\/(.*)$/;

    const matchOpen = value.match(driveOpenLink);
    const matchFile = value.match(driveFileLink);

    if (matchOpen) {
      return matchOpen[1];
    }

    if (matchFile) {
      return matchFile[1];
    }

    return null;
  };

  const getImageId = (value: string) => {
    const inpureId = getImageIdWithNoise(value);

    if (inpureId) {
      const indexToStop = inpureId.lastIndexOf("/view");

      if (indexToStop === -1) {
        return inpureId;
      }

      const id = inpureId.substring(0, indexToStop);

      return id;
    }
  };

  const toGoogleDriveToImageSource = (value: string) => {
    const url = `https://drive.google.com/uc?export=view&id=${getImageId(value)}`;
    return url;
  };

  return (
    <div className="pb-2">
      <div className="m-2 text-xl text-center">
        {`${billboard.serialCode}. ${billboard.address}`}
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
                  <Image 
                    src={toGoogleDriveToImageSource(side.googlePhotoUrl)}
                    alt="Neveikianti plokštumos nuotrauka"
                    width={200}
                    height={150}
                    style={{objectFit: "cover"}} />
                  {/* <iframe src={googleDriveToImageSource(side.googlePhotoUrl)} allow="autoplay" width="200" height="150"/> */}
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
