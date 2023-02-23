import React from "react";
import type { NextPage } from "next";
import { trpc } from "../../../utils/trpc";
import * as RHF from "react-hook-form";
import {
  BillboardCU,
  billboardSchema,
} from "../../../types/command/billboard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as NextRouter from "next/router";
import Components from "../../components";
import SubmitButton from "../../components/form/SubmitButton";
import BillboardFormFields from "../../multi-page-components/billboard/BillboardFormFields";

const CreateBillboardPage: NextPage = () => {
  const router = NextRouter.useRouter();
  const areaQuery = trpc.useQuery(["area.getAll"]);
  const typesQuery = trpc.useQuery(["billboardType.getAll"]);

  const billboardCreate = trpc.useMutation(["billboard.create"], {
    onSuccess: () => {
      router.push("/billboards");
    },
  });

  const form = RHF.useForm<BillboardCU>({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      areaId: "",
    },
  });

  const submitBillboard = (values: BillboardCU) => {
    billboardCreate.mutate(values);
  };

  if (areaQuery.isLoading && typesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Components.Layout>
      <div className="flex justify-center">
        <Components.Paper className="m-4 bg-gray-50 p-4">
          <div className="text-center text-xl font-semibold">Kurti objektą</div>
          <form
            onSubmit={(e) => {
              form.handleSubmit(submitBillboard)(e);
            }}
          >
            <BillboardFormFields
              areas={areaQuery.data || []}
              form={form}
              types={typesQuery.data || []}
            />
            <div className="flex justify-center">
              <SubmitButton isSubmitting={billboardCreate.isLoading}>
                Kurti naują
              </SubmitButton>
            </div>
          </form>
        </Components.Paper>
      </div>
    </Components.Layout>
  );
};

export default CreateBillboardPage;
