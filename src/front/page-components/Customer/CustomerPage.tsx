import React from "react";
import type { NextPage } from "next";
import Components from "../../components";
import ActionButton from "../../components/ActionButton";
import CustomerCreateDialog from "../../multi-page-components/customer/CustomerCreateDialog";

const CustomerPage: NextPage = () => {

  const [openCreate, setOpenCreate] = React.useState(false);

  return (
    <>
      <Components.Layout>
        <ActionButton onClick={() => {setOpenCreate(true);}}>
        Sukurti naują klientą
        </ActionButton>
        <CustomerCreateDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      </Components.Layout>
    </>
  );
};

export default CustomerPage;
