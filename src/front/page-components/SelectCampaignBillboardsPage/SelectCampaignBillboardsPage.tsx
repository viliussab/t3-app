
import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CampaignBillboardSelect, campaignSelectBillboardsSchema } from "../../../types/command/campaignSelectBillboards.schema";
import Layout from "./../../components/Layout";
import { trpc } from "./../../../utils/trpc";
import React from "react";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import { BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";
import billboardMapper from "./../../mappers/billboard";
import Paper from "../../components/Paper";
import ActionButton from "./../../components/ActionButton";
import * as Mui from "@mui/material";
import Table, { ColumnConfig } from "../../components/Table";
import Icons from "./../../components/Icons";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";
import dynamic from "next/dynamic";

const BillboardsMap = dynamic(() => import("../../multi-page-components/geo/maps/BillboardsMap"), {ssr: false});

const SelectCampaignBillboardsPage : NextPage = () => {

  const router = useRouter();
  const { id } = router.query;

  const campaignQuery = trpc.useQuery(["campaign.getById", {id: id as string}]);

  const form = useForm<CampaignBillboardSelect>({
    resolver: zodResolver(campaignSelectBillboardsSchema),
    defaultValues: {
      ids: []
    }
  });

  const [openMap, setOpenMap] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);

  const [selected, setSelected] = React.useState<BillboardUniqueSideDto[]>([]); 

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

  const filteredQuery = trpc.useQuery(["billboard.getFiltered", filters]);
  const areaQuery = trpc.useQuery(["area.getAll"]);

  const onFilterChange = (fieldName: keyof BillboardFilterObj, newValue: BillboardFilterObj[keyof BillboardFilterObj]) => {
    setFilters({...filters, [fieldName]: newValue });
  };

  React.useEffect(() => {
    form.setValue("ids", selected.map(x => x.id));
  }, [form, selected]);

  if (campaignQuery.isLoading || sideNamesQuery.isLoading || areaQuery.isLoading) {
    return <>Loading</>;
  }

  if (!campaignQuery.data) {
    return <>Error</>;
  }

  const availableSides = filteredQuery.data
    ? billboardMapper.toUniqueSides(filteredQuery.data.slice(0, Math.min(filteredQuery.data.length, 20)))
    : [];

  const campaign = campaignQuery.data;

  // TODO: add select to decide which city
  const kaunas = areaQuery.data?.find(area => area.locationName === "Kaunas");

  const selectListColumns: ColumnConfig<BillboardUniqueSideDto>[] = [
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

  const selectedColumns: ColumnConfig<BillboardUniqueSideDto>[] = [
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
      title: "Ištrinti",
      renderCell: (billboard) => (
        <div className="text-lg hover:text-rose-800" >
          <Icons.Delete onClick={() => selectOrDeselect(billboard)}/>
        </div>
      ),
      key: "delete"
    }
  ];

  const selectOrDeselect = (billboard : BillboardUniqueSideDto) => {
    if (selected.some(x => x.side.id === billboard.side.id)) {
      setSelected((prev) => prev.filter(x => x.side.id !== billboard.side.id));
      return;
    }

    setSelected((prev) => [...prev, billboard]);
  };

  return (
    <Layout>
      <div className="flex justify-center m-4">
        <Paper className="m-4 p-4 bg-gray-50">
          <div className="text-center text-xl font-semibold">
            {`Pasirinkti kampanijos "${campaign.name}" stoteles`}
          </div>
          <div className="mt-4 text-center text-xl italic">
            {`Dar liko pasirinkti ${campaign.sideAmount - selected.length} stoteles`}
          </div>
          {selected.length
            ? (
              <div className="flex justify-center mt-2 mb-2">
                <Table 
                  columns={selectedColumns}
                  keySelector={(billboard) => billboard.side.id}
                  data={selected}
                />
              </div>
            )
            : null}
          <div className="mt-6 flex justify-center gap-2">
            <ActionButton onClick={() => setOpenMap(true)}>
                Pasirinkti iš žemėlapio
            </ActionButton>
            <ActionButton onClick={() => setOpenList(true)}>
                Pasirinkti iš sąrašo
            </ActionButton>
            <Mui.Dialog open={openMap} maxWidth="xl" onClose={() => setOpenMap(false)}>
              <div className="mt-4 text-center text-xl italic mb-4 sticky top-0 h-6">
                {`Dar liko pasirinkti ${campaign.sideAmount - selected.length} stoteles`}
              </div>
              <div className="flex justify-center mb-4">
                <BillboardFilters
                  sideNames={sideNamesQuery.data || []}
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
              {
                filteredQuery.data && kaunas ? (
                  <div className="flex justify-center align-middle w-full h-full">
                    <div style={{height: "700px", width: "1100px"}}>
                      <BillboardsMap
                        area={kaunas}
                        billboards={filteredQuery.data}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center align-middle w-full h-full" style={{height: "700px", width: "1100px"}}>
                    <Mui.CircularProgress/>
                  </div>
                )
              }
            </Mui.Dialog>
            <Mui.Dialog open={openList} maxWidth="xl" onClose={() => setOpenList(false)}>
              <div className="mt-4 text-center text-xl italic mb-4 sticky top-0 h-6">
                {`Dar liko pasirinkti ${campaign.sideAmount - selected.length} stoteles`}
              </div>
              <div className="flex justify-center mb-4">
                <BillboardFilters
                  sideNames={sideNamesQuery.data || []}
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
              {
                !filteredQuery.isLoading ? (
                  <Table
                    columns={selectListColumns}
                    keySelector={(billboard) => billboard.side.id}
                    data={availableSides}
                    selectedKeys={selected.map((x) => x.side.id)}
                    onClick={selectOrDeselect}
                  />
                ) : (
                  <div className="flex justify-center align-middle w-full h-full" style={{height: "800px"}}>
                    <Mui.CircularProgress/>
                  </div>
                )
              }
            </Mui.Dialog>
          </div>
        </Paper>
      </div>
    </Layout>
  );
};

export default SelectCampaignBillboardsPage;
