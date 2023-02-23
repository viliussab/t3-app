import React from "react";
import { BillboardDto } from "../../../types/dto/BillboardDtos";
import { Divider } from "@mui/material";
import ActionButton from "../../components/ActionButton";
import GoogleSideImage from "./../../components/GoogleSideImage";
import { useRouter } from "next/router";

type BillboardCardProps = {
  billboard: BillboardDto;
};

const BillboardEditCard = ({ billboard }: BillboardCardProps) => {
  const router = useRouter();

  const redirectToBillboardEdit = () => {
    router.push("/billboards/" + billboard.id);
  };

  return (
    <div className="mb-2">
      <div className="m-2 text-center text-xl">
        {`${billboard.serialCode}. ${billboard.address}`}
      </div>
      <div className="mb-2 flex justify-end">
        <ActionButton onClick={redirectToBillboardEdit}>
          Redaguoti objektą
        </ActionButton>
      </div>
      {billboard.sides.map((side) => (
        <>
          <div key={side.id} className="flex gap-2">
            <div
              className="flex flex-col justify-between p-4 pt-1"
              style={{ width: "300px" }}
            >
              <div>
                <div className="text-lg">{`${side.title}`}</div>
                <div className="text-bold text-base text-gray-600">{`${side.sideType} pusė`}</div>
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
