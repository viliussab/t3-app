import { NextPage } from "next";
import Layout from "../../front/components/Layout";
import { trpc } from "./../../utils/trpc";
import { Billboard } from "@prisma/client";
import { BillboardGetBySidesDto } from "../../types/billboard.schema";

const BillboardList: NextPage = () => {

  const billboardQuery = trpc.useQuery(["billboard.getAsSides"]);

  if (billboardQuery.isLoading) {
    return "Loading...";
  }

  console.log(billboardQuery.data, "data");

  return (
    <Layout>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
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
            {billboardQuery.data?.map((billboard, index) => ( 
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
        billboard: BillboardGetBySidesDto,
        index: number,
};

const BillboardTableRow = (props: BillboardTableRowProps) => {

  const {billboard, index} = props;
        
  return (
    <tr className={ (index + 1) % 2 ? 
      "bg-white border-b dark:bg-gray-900 dark:border-gray-700" 
      : "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700" }>
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
        {billboard.isLicensed}
      </td>
      <td className="py-4 px-6">
        {billboard.isIlluminated}
      </td>
    </tr>
  );
};

export default BillboardList;
