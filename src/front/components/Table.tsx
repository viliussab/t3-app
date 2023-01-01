import React from "react";

export type ColumnConfig<T> = {
    title: string,
    renderCell: (elem: T) => React.ReactNode,
    key: string,
    type?: "main"
}

type TableProps<T> = {
    columns: ColumnConfig<T>[]
    data: T[],
    onClick?: (elem: T) => void,
    keySelector: (elem: T) => string,
}
  
export default function Table<T>({columns, data, onClick, keySelector} : TableProps<T>) {
  const headers = columns.map(c => c.title);

  return (

    <table className="text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
          {headers.map((columnName) => (
            <th scope="col" key={columnName} className="py-3 px-6">
              <div className="text-sm flex align-middle justify-center">
                {columnName}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(elem => (
          <tr
            key={keySelector(elem)}
            onClick={() => onClick && onClick(elem)}
            className={`nth border-b even:bg-gray-50 odd:bg-white hover:bg-blue-100"
                ${onClick ? "hover:cursor-pointer" : "" }`}>
            {columns.map(c => (
              <td key={c.key} className="py-4 px-6">
                <div className="flex align-middle justify-center">
                  {c.renderCell(elem)}
                </div>
              </td>))}
          </tr>
        ))}
      </tbody>
    </table>

  );
}
