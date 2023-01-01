import React from "react";

type Props = {
    status: string,
}

const CampaignStatusChip = (props: Props) => {
  const {status} = props;

  return (
    <span
      className="px-4 py-2 rounded-full text-gray-100 bg-blue-500 font-semibold text-sm flex align-center w-max active:bg-gray-300 transition duration-300 ease">
      {status}
    </span>
    
  );
};

export default CampaignStatusChip;
