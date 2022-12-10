import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import React from "react";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";
import * as Mui from "@mui/material";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import { BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos.schema";
import billboardMapper from "../../mappers/billboard";

const BillboardListPage: NextPage = () => {

  const [filters, setFilters] = React.useState<BillboardFilterObj>({
    allowedSides: [],
    illumination: BooleanFilters.Both,
    license: BooleanFilters.Both,
    search: ""
  });

  const sideNamesQuery = trpc.useQuery(["billboard.getDistinctSideNames"], {
    onSuccess: (data) => {
      setFilters({...filters, allowedSides: data});
    }
  });

  const billboardQuery = trpc.useQuery(["billboard.getFiltered", {...filters}], {enabled: !sideNamesQuery.isLoading});

  const onFilterChange = (fieldName: keyof BillboardFilterObj, newValue: BillboardFilterObj[keyof BillboardFilterObj]) => {
    setFilters({...filters, [fieldName]: newValue });
  };

  if (billboardQuery.isLoading && sideNamesQuery.isLoading) {
    return <>Loading...</>;
  }

  const billboardUniqueSides = billboardMapper.toUniqueSides(billboardQuery.data);

  return (
    <Layout>
      <div className="mt-4">
        {
          sideNamesQuery.data && (
            <div className="flex justify-center">
              <BillboardFilters
                sideNames={sideNamesQuery.data}
                filters={filters}
                onFilterChange={onFilterChange}
              />
            </div>
          )
        }
        <div className="mt-4 overflow-x-auto relative shadow-md sm:rounded-lg flex justify-center">
          <table className="text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
              {billboardUniqueSides?.map((billboard, index) => ( 
                <BillboardTableRow
                  billboard={billboard}
                  index={index}
                  key={billboard.side.id}/>)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

type BillboardTableRowProps = {
  billboard: BillboardUniqueSideDto,
  index: number,
};

const BillboardTableRow = (props: BillboardTableRowProps) => {

  const {billboard: billboard, index} = props;
        
  return (
    <tr 
      className={ 
        `${index % 2 ? "bg-gray-50" : "bg-white"}
        border-b hover:bg-blue-100 hover:cursor-pointer`} >
      <td className="py-4 px-6">
        {billboard.area.locationName}
      </td>
      <td className="py-4 px-6">
        {billboard.serialCode}
      </td>
      <th className="py-4 px-6 text-gray-900 whitespace-nowrap">
        {billboard.name}
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
