import { CampaignStatus } from "@prisma/client";
import React from "react";

type Props = {
    status: CampaignStatus,
}

const getConfig = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.PREPARED: return {
      text: "Laukiama patvirtinimo",
      color: "bg-gray-400",
    }
    case CampaignStatus.SELECTED: return {
      text: "Parinktos stoteles",
      color: "bg-green-700"
    }
    case CampaignStatus.CONFIRMED: return {
      text: "Patvirtintas",
      color: "bg-blue-400",
    }
    default: return {
      text: "Ivykdytas",
      color: "bg-green-500"
    }
  }
}

const CampaignStatusChip = (props: Props) => {
  const {status} = props;

  const config = getConfig(status);
  console.log('status', status, config);
  return (
    <span
      className={`p-2 rounded-full text-white ${config.color} font-semibold flex align-center w-max`}>
      {config.text}
    </span>
    
  );
};

export default CampaignStatusChip;
