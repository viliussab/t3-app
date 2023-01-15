import React from "react";
import Icons from "../../components/Icons";
import { BillboardDto } from "../../../types/dto/BillboardDtos";
import Image from "next/image";

type BillboardCardProps = {
    billboard: BillboardDto,
}

const BillboardCard = (props : BillboardCardProps) => {
  const { billboard } = props;

  return (
    <div className="m-4">
      <div className="text-lg">
        {billboard.address}
      </div>
      <div className="grid-cols-2 grid">
        {billboard.sides.map(side => (
          <div key={side.id} className="flex items-center gap-2">
            <span className="text-base">{`${side.sideType} pusė`}</span>
            {side.googlePhotoUrl && (
              <>
                <a href={side.googlePhotoUrl}>
                  <Icons.PhotoCamera size={22}/>
                </a>
                <div className="w-64 h-48">
                  <img
                    src={side.googlePhotoUrl}
                    alt="stotelės nuotrauka"/>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default BillboardCard;
