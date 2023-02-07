import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  CampaignBillboardSelect,
  campaignSelectBillboardsSchema,
} from "../../../types/command/campaignSelectBillboards.schema";
import Layout from "../../components/Layout";
import { trpc } from "../../../utils/trpc";
import React from "react";
import { BillboardFilterObj } from "../../../types/filters/billboardFilter.schema";
import { BooleanFilters } from "../../../types/filters/booleanFilter.schema";
import { BillboardUniqueSideDto } from "../../../types/dto/BillboardDtos";
import billboardMapper from "../../mappers/billboard";
import Paper from "../../components/Paper";
import ActionButton from "../../components/ActionButton";
import * as Mui from "@mui/material";
import Table, { ColumnConfig } from "../../components/Table";
import Icons from "../../components/Icons";
import BillboardFilters from "../../multi-page-components/billboard/BillboardFilters";
import dynamic from "next/dynamic";
import BillboardSelectCard from "../../multi-page-components/billboard/BillboardSelectCard";
import SubmitButton from "../../components/form/SubmitButton";

const BillboardsMap = dynamic(
  () => import("../../multi-page-components/geo/maps/BillboardsMap"),
  { ssr: false }
);

const CampaignSelectBillboardsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const campaignQuery = trpc.useQuery([
    "campaign.getById",
    { id: id as string },
  ]);
  const campaignBillboardsUpdate = trpc.useMutation(
    ["campaign.updateBillboards"],
    {
      onSuccess: () => {
        router.push("campaigns");
      },
    }
  );

  const form = useForm<CampaignBillboardSelect>({
    resolver: zodResolver(campaignSelectBillboardsSchema),
    defaultValues: {
      sideIds: [],
      id: id as string,
    },
  });

  const [openMap, setOpenMap] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [selected, setSelected] = React.useState<BillboardUniqueSideDto[]>([]);
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
  const filteredQuery = trpc.useQuery(["billboard.getFiltered", filters]);
  const areaQuery = trpc.useQuery(["area.getAll"]);

  const onFilterChange = (
    fieldName: keyof BillboardFilterObj,
    newValue: BillboardFilterObj[keyof BillboardFilterObj]
  ) => {
    setFilters({ ...filters, [fieldName]: newValue });
  };

  React.useEffect(() => {
    form.setValue(
      "sideIds",
      selected.map((x) => x.side.id)
    );
  }, [form, selected]);

  if (
    campaignQuery.isLoading ||
    sideNamesQuery.isLoading ||
    areaQuery.isLoading
  ) {
    return <>Loading</>;
  }

  if (!campaignQuery.data) {
    return <>Error</>;
  }

  const availableSides = filteredQuery.data
    ? billboardMapper.toUniqueSides(
        filteredQuery.data.slice(0, Math.min(filteredQuery.data.length, 20))
      )
    : [];

  const campaign = campaignQuery.data;

  const isAllSelected = campaign.sideAmount === selected.length;

  // TODO: add select to decide which city
  const kaunas = areaQuery.data?.find((area) => area.locationName === "Kaunas");

  const selectListColumns: ColumnConfig<BillboardUniqueSideDto>[] = [
    {
      title: "Miestas",
      renderCell: (billboard) => <>{billboard.area.locationName}</>,
      key: "city",
    },
    {
      title: "Kodas",
      renderCell: (billboard) => <>{billboard.serialCode}</>,
      key: "serialCode",
    },
    {
      title: "Pavadinimas",
      renderCell: (billboard) => <>{billboard.side.title}</>,
      key: "name",
    },
    {
      title: "Adresas",
      renderCell: (billboard) => <>{billboard.address}</>,
      key: "address",
    },
    {
      title: "Tipas",
      renderCell: (billboard) => <>{billboard.type.name}</>,
      key: "typeName",
    },
    {
      title: "Pusė",
      renderCell: (billboard) => <>{billboard.side.sideType}</>,
      key: "sideName",
    },
    {
      title: "Leidimas",
      renderCell: (billboard) => (
        <Mui.Checkbox
          key={billboard.id}
          checked={billboard.isLicensed}
          disabled
        />
      ),
      key: "isLicensed",
    },
    {
      title: "Apšvietimas",
      renderCell: (billboard) => (
        <Mui.Checkbox
          key={billboard.id}
          checked={billboard.isIlluminated}
          disabled
        />
      ),
      key: "isIlluminated",
    },
  ];

  const selectedColumns: ColumnConfig<BillboardUniqueSideDto>[] = [
    {
      title: "Pavadinimas",
      renderCell: (billboard) => <>{billboard.side.title}</>,
      key: "name",
    },
    {
      title: "Adresas",
      renderCell: (billboard) => <>{billboard.address}</>,
      key: "address",
    },
    {
      title: "Tipas",
      renderCell: (billboard) => <>{billboard.type.name}</>,
      key: "typeName",
    },
    {
      title: "Pusė",
      renderCell: (billboard) => <>{billboard.side.sideType}</>,
      key: "sideName",
    },
    {
      title: "Ištrinti",
      renderCell: (billboard) => (
        <div className="text-lg hover:text-rose-800">
          <Icons.Delete onClick={() => selectOrDeselect(billboard)} />
        </div>
      ),
      key: "delete",
    },
  ];

  const selectOrDeselect = (billboard: BillboardUniqueSideDto) => {
    if (selected.some((x) => x.side.id === billboard.side.id)) {
      setSelected((prev) =>
        prev.filter((x) => x.side.id !== billboard.side.id)
      );
      return;
    }

    setSelected((prev) => [...prev, billboard]);
  };

  const renderLeftToSelect = () => {
    if (isAllSelected) {
      return (
        <div className="mt-4 text-center text-xl text-green-600">
          Stotelių kiekis tinkamas
        </div>
      );
    }

    if (selected.length > campaign.sideAmount) {
      return (
        <div className="mt-4 text-center text-xl text-red-600">
          {`Pasirinkta ${
            selected.length - campaign.sideAmount
          } stotelėmis per daug`}
        </div>
      );
    }

    return (
      <div className="mt-4 text-center text-xl italic">
        {`Dar liko pasirinkti ${
          campaign.sideAmount - selected.length
        } stoteles`}
      </div>
    );
  };

  return (
    <Layout>
      <div className="m-4 flex justify-center">
        <Paper className="m-4 bg-gray-50 p-4">
          <div className="text-center text-xl font-semibold">
            {`Pasirinkti kampanijos "${campaign.name}" stoteles`}
          </div>
          {renderLeftToSelect()}
          {selected.length ? (
            <div className="mt-2 mb-2 flex justify-center">
              <Table
                columns={selectedColumns}
                keySelector={(billboard) => billboard.side.id}
                data={selected}
              />
            </div>
          ) : null}
          <div className="mt-6 flex justify-center gap-2">
            <ActionButton onClick={() => setOpenMap(true)}>
              Pasirinkti iš žemėlapio
            </ActionButton>
            <ActionButton onClick={() => setOpenList(true)}>
              Pasirinkti iš sąrašo
            </ActionButton>
            <Mui.Dialog
              open={openMap}
              maxWidth="xl"
              onClose={() => setOpenMap(false)}
            >
              {renderLeftToSelect()}
              <div className="mt-4 mb-4 flex justify-center">
                <BillboardFilters
                  sideNames={sideNamesQuery.data || []}
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
              {filteredQuery.data && kaunas ? (
                <div className="flex h-full w-full justify-center align-middle">
                  <div style={{ height: "700px", width: "1100px" }}>
                    <BillboardsMap
                      area={kaunas}
                      billboards={filteredQuery.data}
                      renderDialog={(billboard) => (
                        <BillboardSelectCard
                          billboard={billboard}
                          onSideSelect={selectOrDeselect}
                          selectedKeys={selected.map((x) => x.side.id)}
                        />
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full w-full justify-center align-middle"
                  style={{ height: "700px", width: "1100px" }}
                >
                  <Mui.CircularProgress />
                </div>
              )}
            </Mui.Dialog>
            <Mui.Dialog
              open={openList}
              maxWidth="xl"
              onClose={() => setOpenList(false)}
            >
              <div className="sticky top-0 z-10 mt-4 bg-white">
                {renderLeftToSelect()}
                <div className="mt-4 flex justify-center">
                  <BillboardFilters
                    sideNames={sideNamesQuery.data || []}
                    filters={filters}
                    onFilterChange={onFilterChange}
                  />
                </div>
              </div>
              <div className="mb-4" />
              {!filteredQuery.isLoading ? (
                <Table
                  columns={selectListColumns}
                  keySelector={(billboard) => billboard.side.id}
                  data={availableSides}
                  selectedKeys={selected.map((x) => x.side.id)}
                  onClick={selectOrDeselect}
                />
              ) : (
                <div
                  className="flex h-full w-full justify-center align-middle"
                  style={{ height: "800px" }}
                >
                  <Mui.CircularProgress />
                </div>
              )}
            </Mui.Dialog>
          </div>
          <form
            onSubmit={(e) => {
              form.handleSubmit((values) =>
                campaignBillboardsUpdate.mutateAsync(values)
              )(e);
            }}
          >
            <SubmitButton
              isSubmitting={campaignBillboardsUpdate.isLoading}
              buttonProps={{
                disabled: !isAllSelected,
              }}
            >
              Kurti naują
            </SubmitButton>
          </form>
        </Paper>
      </div>
    </Layout>
  );
};

export default CampaignSelectBillboardsPage;
