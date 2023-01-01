import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import React from "react";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";
import * as Mui from "@mui/material";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import billboardMapper from "../../mappers/billboard";
import Table, { ColumnConfig } from "../../components/table";
import { BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";

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

  const columns: ColumnConfig<BillboardUniqueSideDto>[] = [
    {
      title: "Miestas",
      renderCell: (billboard) => <>{billboard.area.locationName}</>,
      key: "city"
    },
    {
      title: "Kodas",
      renderCell: (billboard) => <>{billboard.serialCode}</>,
      key: "serialCode"
    },
    {
      title: "Pavadinimas",
      renderCell: (billboard) => <>{billboard.name}</>,
      key: "name"
    },
    {
      title: "Adresas",
      renderCell: (billboard) => <>{billboard.address}</>,
      key: "address"
    }, 
    {
      title: "Tipas",
      renderCell: (billboard) => <>{billboard.type.name}</>,
      key: "typeName"
    },
    {
      title: "Pusė",
      renderCell: (billboard) => <>{billboard.side.name}</>,
      key: "sideName"
    }, 
    {
      title: "Leidimas",
      renderCell: (billboard) => <Mui.Checkbox key={billboard.id} checked={billboard.isLicensed} disabled />,
      key: "isLicensed"
    },
    {
      title: "Apšvietimas",
      renderCell: (billboard) => <Mui.Checkbox key={billboard.id} checked={billboard.isIlluminated} disabled />,
      key: "isIlluminated"
    }
  ];

  return (
    <Layout>
      <div className="mt-4">
        {sideNamesQuery.data && (
          <div className="flex justify-center">
            <BillboardFilters
              sideNames={sideNamesQuery.data}
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <Table
            columns={columns}
            keySelector={(billboard) => billboard.side.id}
            data={billboardUniqueSides}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BillboardListPage;
