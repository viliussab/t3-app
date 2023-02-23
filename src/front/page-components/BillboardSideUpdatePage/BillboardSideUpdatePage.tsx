import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import {
  BillboardUpdate,
  billboardUpdateSchema,
} from "../../../types/command/billboard.schema";
import { trpc } from "../../../utils/trpc";
import Components from "../../components";
import SubmitButton from "../../components/form/SubmitButton";
import RHF from "../../imports/RHF";
import BillboardFormFields from "../../multi-page-components/billboard/BillboardFormFields";

type Props = {};

const BillboardSideUpdatePage = (props: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const billboardQuery = trpc.useQuery(
    ["billboard.getSideById", { id: id as string }],
    {
      onSuccess(data) {
        form.reset(data);
      },
    }
  );

  const areaQuery = trpc.useQuery(["area.getAll"]);
  const typesQuery = trpc.useQuery(["billboardType.getAll"]);

  const billboardCreate = trpc.useMutation(["billboard.update"], {
    onSuccess: () => {
      router.push("/billboards");
    },
  });

  const form = RHF.useForm<BillboardUpdate>({
    resolver: zodResolver(billboardUpdateSchema),
    defaultValues: {
      areaId: "",
      typeId: "",
    },
  });

  const submitBillboard = (values: BillboardUpdate) => {
    billboardCreate.mutate(values);
  };

  if (areaQuery.isLoading && typesQuery.isLoading && billboardQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Components.Layout>
      <div className="flex justify-center">
        <Components.Paper className="m-4 bg-gray-50 p-4">
          <div className="text-center text-xl font-semibold">
            Atnaujinti stotelės pusę
          </div>
          <form
            onSubmit={(e) => {
              form.handleSubmit(submitBillboard)(e);
            }}
          ></form>
        </Components.Paper>
      </div>
    </Components.Layout>
  );
};

export default BillboardSideUpdatePage;
