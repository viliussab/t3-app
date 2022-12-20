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
      BodyComponent: (c) => <>{c.name}</>,
      key: "Title"
    },
    {
      title: "Adresas",
      BodyComponent: (c) => <>{c.address}</>,
      key: "address"
    },
    {
      title: "Telefonas",
      BodyComponent: (c) => <>{c.phone}</>,
      key: "phone"
    },
    {
      title: "Kontaktinis asmuo",
      BodyComponent: (c) => <>{c.contactPerson}</>,
      key: "contactPerson"
    }, 
    {
      title: "Paštas",
      BodyComponent: (c) => <>{c.email}</>,
      key: "email"
    },
    {
      title: "Atnaujinti",
      BodyComponent: (c) => {
        const [open, setOpen] = React.useState(false);

        return <div className="flex justify-center align-center">
          <Icons.Edit
            size={22}
            className="hover:cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}/>
          <CustomerUpdateDialog
            customer={c}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>;
      },
      key: "update"
    }
  ];

  return (
    <>
      <Components.Layout>
        <div className="flex justify-center m-4">
          <div className="flex flex-col align-center w-auto">
            <div className="flex justify-center">
              <ActionButton onClick={() => {setOpenCreate(true);}}>
              Sukurti naują klientą
              </ActionButton>
            </div>
            <CustomerCreateDialog
              open={openCreate}
              onClose={() => setOpenCreate(false)}
            />
            {customersQuery.data && (
              <div className="mt-4 overflow-x-auto relative shadow-md sm:rounded-lg">
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
