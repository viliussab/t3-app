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
    selectedKeys?: string[],
    hideHeader?: boolean,
    topOffset?: number,
}
  
export default function Table<T>({columns, data, onClick, keySelector, selectedKeys, hideHeader, topOffset = 0} : TableProps<T>) {
  const headers = columns.map(c => c.title);

  return (
    <table className="text-sm text-left text-gray-500">
      {!hideHeader && (
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {headers.map((columnName) => (
              <th scope="col" key={columnName} className={`py-3 px-6 sticky bg-gray-100 top-${topOffset.toString()}`}>
                <div className="text-sm flex align-middle justify-center">
                  {columnName}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map(elem => (
          <tr
            key={keySelector(elem)}
            onClick={() => onClick && onClick(elem)}
            className={`nth border-b
                ${onClick ? "hover:cursor-pointer" : "" }
                ${(selectedKeys && selectedKeys.some(x => x === keySelector(elem))
            ? "bg-lime-600 text-white hover:bg-rose-800 font-semibold"
            : "even:bg-gray-50 odd:bg-white hover:bg-blue-200")}`}>
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
