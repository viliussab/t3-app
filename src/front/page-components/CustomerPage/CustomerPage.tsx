import React from "react";
import type { NextPage } from "next";
import Components from "../../components";
import ActionButton from "../../components/ActionButton";
import CustomerCreateDialog from "../../multi-page-components/customer/CustomerCreateDialog";
import { trpc } from "../../../utils/trpc";
import Table, { ColumnConfig } from "../../components/Table";
import { Customer } from "@prisma/client";
import Icons from "../../components/Icons";
import CustomerUpdateDialog from "../../multi-page-components/customer/CustomerUpdateDialog";

const CustomerPage: NextPage = () => {
  const [openCreate, setOpenCreate] = React.useState(false);

  const customersQuery = trpc.useQuery(["customer.getAll"]);

  if (customersQuery.isLoading) {
    return null;
  }

  const columns: ColumnConfig<Customer>[] = [
    {
      title: "Pavadinimas",
      renderCell: (c) => <>{c.name}</>,
      key: "Title",
    },
    {
      title: "Adresas",
      renderCell: (c) => <>{c.address}</>,
      key: "address",
    },
    {
      title: "Telefonas",
      renderCell: (c) => <>{c.phone}</>,
      key: "phone",
    },
    {
      title: "Kontaktinis asmuo",
      renderCell: (c) => <>{c.contactPerson}</>,
      key: "contactPerson",
    },
    {
      title: "Paštas",
      renderCell: (c) => <>{c.email}</>,
      key: "email",
    },
    {
      title: "Atnaujinti",
      renderCell: (c) => {
        const [open, setOpen] = React.useState(false);

        return (
          <div className="align-center flex justify-center">
            <Icons.Edit
              size={22}
              className="hover:cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            />
            <CustomerUpdateDialog
              customer={c}
              open={open}
              onClose={() => setOpen(false)}
            />
          </div>
        );
      },
      key: "update",
    },
  ];

  return (
    <>
      <Components.Layout>
        <div className="m-4 flex justify-center">
          <div className="align-center flex w-auto flex-col">
            <div className="flex justify-center">
              <ActionButton
                onClick={() => {
                  setOpenCreate(true);
                }}
              >
                Sukurti naują klientą
              </ActionButton>
            </div>
            <CustomerCreateDialog
              open={openCreate}
              onClose={() => setOpenCreate(false)}
            />
            {customersQuery.data && (
              <div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
                <Table
                  columns={columns}
                  keySelector={(c) => c.id}
                  data={customersQuery.data}
                />
              </div>
            )}
          </div>
        </div>
      </Components.Layout>
    </>
  );
};

export default CustomerPage;
