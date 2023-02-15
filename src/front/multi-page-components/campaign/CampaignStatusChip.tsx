import { CampaignStatus } from "@prisma/client";
import React from "react";

type Props = {
  status: CampaignStatus;
};

const getConfig = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.PREPARED:
      return {
        text: "Laukiama patvirtinimo",
        color: "bg-gray-400",
      };
    case CampaignStatus.SELECTED:
      return {
        text: "Parinktos stoteles",
        color: "bg-green-700",
      };
    case CampaignStatus.CONFIRMED:
      return {
        text: "Patvirtintas",
        color: "bg-blue-400",
      };
    default:
      return {
        text: "Ivykdytas",
        color: "bg-green-500",
      };
  }
};

const CampaignStatusChip = (props: Props) => {
  const { status } = props;

  const config = getConfig(status);
  return (
    <span
      className={`rounded-full p-2 text-white ${config.color} align-center flex w-max font-semibold`}
    >
      {config.text}
    </span>
  );
};

export default CampaignStatusChip;
