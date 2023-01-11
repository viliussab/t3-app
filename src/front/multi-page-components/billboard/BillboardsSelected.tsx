import React from "react";
import { BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos.schema";

type BillboardsSelectedProps = {
    selected: BillboardUniqueSideDto[] | undefined,
}

const BillboardsSelected = (props : BillboardsSelectedProps) => {
  const { selected } = props;

  if (!selected || !selected.length) {
    return null;
  }

  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="py-3 px-6">
                Pavadinimas
          </th>
          <th scope="col" className="py-3 px-6">
                Adresas
          </th>
          <th scope="col" className="py-3 px-6">
                Pusė
          </th>
        </tr>
      </thead>
      <tbody>
        {selected?.map((billboard) => ( 
          <tr key={billboard.side.id} >
            <td className="py-4 px-6">
              {billboard.side.title}
            </td>
            <td className="py-4 px-6">
              {billboard.address}
            </td>
            <td className="py-4 px-6">
              {billboard.side.sideType}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BillboardsSelected;
