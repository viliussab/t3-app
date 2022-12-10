import React from "react";
import Icons from "../../components/Icons";
import { BillboardDto } from "../../../types/dto/BillboardDtos.schema";

type BillboardCardProps = {
    billboard: BillboardDto,
}

const BillboardCard = (props : BillboardCardProps) => {
  const { billboard } = props;

  return (
    <div className="min-w-48">
      <span className="text-lg font-bold">
        {billboard.name}
      </span>
      <div className="text-lg text-gray-600">
        {` ${billboard.type.name}`}
      </div>
      <div className="">
        {billboard.sides.map(side => (
          <div key={side.id} className="mt-4 gap-4 flex items-center justify-between">
            <span className="text-base">{`${side.name} pusė`}</span>
            <a href="https://drive.google.com/file/d/1Nd4iSSP7esEMwp17z3nLsxBUv-wJ0Dtk/preview">
              <Icons.PhotoCamera size={22}/>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillboardCard;
