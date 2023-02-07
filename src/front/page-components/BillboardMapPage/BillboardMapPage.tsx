import { NextPage } from "next";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import React from "react";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import dynamic from "next/dynamic";
import styles from "./BillboardMapPage.module.css";
import BillboardEditCard from "../../multi-page-components/billboard/BillboardEditCard";

const BillboardsMap = dynamic(
  () => import("../../multi-page-components/geo/maps/BillboardsMap"),
  { ssr: false }
);

const BillboardMapPage: NextPage = () => {
  const [filters, setFilters] = React.useState<BillboardFilterObj>({
    allowedSides: [],
    illumination: BooleanFilters.Both,
    license: BooleanFilters.Both,
    search: "",
  });

  const sideNamesQuery = trpc.useQuery(["billboard.getDistinctSideTypes"], {
    onSuccess: (data) => {
      setFilters({ ...filters, allowedSides: data });
    },
  });

  const areaQuery = trpc.useQuery(["area.getAll"]);
  const billboardQuery = trpc.useQuery(
    ["billboard.getFiltered", { ...filters }],
    { enabled: !sideNamesQuery.isLoading }
  );

  const onFilterChange = (
    fieldName: keyof BillboardFilterObj,
    newValue: BillboardFilterObj[keyof BillboardFilterObj]
  ) => {
    setFilters({ ...filters, [fieldName]: newValue });
  };

  if (
    billboardQuery.isLoading &&
    sideNamesQuery.isLoading &&
    areaQuery.isLoading
  ) {
    return <>Loading...</>;
  }

  // TODO: add select to decide which cityÍ
  const kaunas = areaQuery.data?.find((area) => area.locationName === "Kaunas");

  return (
    <Layout>
      <div className="pt-4">
        {sideNamesQuery.data && (
          <div className="flex justify-center pb-4">
            <BillboardFilters
              sideNames={sideNamesQuery.data}
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
        )}
        {billboardQuery.data && kaunas && (
          <div className="flex justify-center">
            <div className={styles.map}>
              <BillboardsMap
                area={kaunas}
                billboards={billboardQuery.data}
                renderDialog={(billboard) => (
                  <BillboardEditCard billboard={billboard} />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillboardMapPage;
