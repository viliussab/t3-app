import { NextPage } from "next";
import Layout from "../../front/components/Layout";

const BillboardList: NextPage = () => {

  return (
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
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17
            </th>
            <td className="py-4 px-6">
                    Sliver
            </td>
            <td className="py-4 px-6">
                    Laptop
            </td>
            <td className="py-4 px-6">
                    $2999
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  );
};

export default BillboardList;
