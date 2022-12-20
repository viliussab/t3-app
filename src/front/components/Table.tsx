import React from "react";

export type ColumnConfig<T> = {
    title: string,
    BodyComponent: (elem: T) => React.ReactNode,
    key: string,
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
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          {headers.map((columnName) => (
            <th scope="col" key={columnName} className="py-3 px-6">
              {columnName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(elem => (
          <tr
            key={keySelector(elem)}
            onClick={() => onClick && onClick(elem)}
            className={`nth border-b odd:bg-gray-50 even:bg-white hover:bg-blue-100
                ${onClick && "hover:cursor-pointer"}`}>
            {columns.map(c => (
              <td key={c.key} className="py-4 px-6">
                {c.BodyComponent(elem)}
              </td>))}
          </tr>
        ))}
      </tbody>
    </table>

  );
}
