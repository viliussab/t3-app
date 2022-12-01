import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { BillboardFilterObj } from "../../../types/billboard.schema";
import React from "react";
import { Area, Billboard, BillboardSide, BillboardType } from "@prisma/client";
import BillboardFilters from "../../components/BillboardFilters";
import * as Mui from "@mui/material";

const BillboardListPage: NextPage = () => {

  const billboardQuery = trpc.useQuery(["billboard.getAll"]);

  const sideNamesQuery = trpc.useQuery(["billboard.getDistinctSideNames"], {
    onSuccess: (data) => {
      setFilters({...filters, allowedSides: data});
    }
  });

  const [filters, setFilters] = React.useState<BillboardFilterObj>({
    allowedSides: [],
    illumination: "True And False",
    license: "True And False",
    search: ""
  });

  const onFilterChange = (fieldName: keyof BillboardFilterObj, newValue: BillboardFilterObj[keyof BillboardFilterObj]) => {
    setFilters({...filters, [fieldName]: newValue });
  };

  if (billboardQuery.isLoading && sideNamesQuery.isLoading) {
    return <>Loading...</>;
  }

  const billboards = billboardQuery.data?.map(
    billboard => billboard.sides.map(side => (
      {
        ...billboard,
        side
      }
    ))
  ).flat();

  return (
    <Layout>
      {
        sideNamesQuery.data && (
          <BillboardFilters
            sideNames={sideNamesQuery.data}
            filters={filters}
            onFilterChange={onFilterChange}
          />
        )
      }

      <div className="mt-2 overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Miestas
              </th>
              <th scope="col" className="py-3 px-6">
                Kodas
              </th>
              <th scope="col" className="py-3 px-6">
                Pavadinimas
              </th>
              <th scope="col" className="py-3 px-6">
                Adresas
              </th>
              <th scope="col" className="py-3 px-6">
                Tipas
              </th>
              <th scope="col" className="py-3 px-6">
                Pusė
              </th>
              <th scope="col" className="py-3 px-6">
                Leidimas
              </th>
              <th scope="col" className="py-3 px-6">
                Apšvietimas
              </th>
            </tr>
          </thead>
          <tbody>
            {billboards?.map((billboard, index) => ( 
              <BillboardTableRow
                billboard={billboard}
                index={index}
                key={billboard.id}/>)
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

type BillboardTableRowProps = {
  billboard: Billboard & {
    type: BillboardType;
    area: Area;
    side: BillboardSide;
},
  index: number,
};

const BillboardTableRow = (props: BillboardTableRowProps) => {

  const {billboard: billboard, index} = props;
        
  return (
    <tr 
      className={ 
        `${index % 2 ? "bg-gray-50" : "bg-white"}
        border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-blue-100 hover:cursor-pointer`} >
      <td className="py-4 px-6">
        {billboard.area.locationName}
      </td>
      <td className="py-4 px-6">
        {billboard.serialCode}
      </td>
      <th className="py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
        {billboard.name + " " + billboard.side.name}
      </th>
      <td className="py-4 px-6">
        {billboard.address}
      </td>
      <td className="py-4 px-6">
        {billboard.type.name}
      </td>
      <td className="py-4 px-6">
        {billboard.side.name}
      </td>
      <td className="py-4 px-6">
        <Mui.Checkbox checked={billboard.isLicensed} />
      </td>
      <td className="py-4 px-6">
        <Mui.Checkbox checked={billboard.isIlluminated} />
      </td>
    </tr>
  );
};

export default BillboardListPage;
