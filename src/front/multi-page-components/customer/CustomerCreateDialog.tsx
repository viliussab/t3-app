import {
  CustomerCreate,
  customerCreateSchema,
} from "../../../types/command/customerCreate.schema";
import * as RHF from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as NextRouter from "next/router";
import { trpc } from "../../../utils/trpc";
import Form from "../../components/form";
import { Dialog } from "@mui/material";
import SubmitButton from "../../components/form/SubmitButton";

type CustomerCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

const CustomerCreateDialog = ({ open, onClose }: CustomerCreateDialogProps) => {
  const router = NextRouter.useRouter();

  const customerCreate = trpc.useMutation(["customer.create"], {
    onSuccess: () => {
      router.reload();
    },
  });

  const form = RHF.useForm<CustomerCreate>({
    resolver: zodResolver(customerCreateSchema),
  });

  const submitBillboard = (values: CustomerCreate) => {
    customerCreate.mutate(values);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex justify-center">
        <div className="bg-gray-50 p-2 pb-4">
          <div className="text-center text-xl font-semibold">Kurti klientą</div>
          <form
            onSubmit={(e) => {
              form.handleSubmit(submitBillboard)(e);
            }}
          >
            <div className="flex justify-center">
              <div className="m-4 w-64 space-y-3 pt-0">
                <Form.Field
                  label="Kompanijos pavadinimas"
                  form={form}
                  fieldName="name"
                  muiProps={{ required: true }}
                />
                <Form.Field
                  label="Įmonės kodas"
                  form={form}
                  fieldName="companyCode"
                  muiProps={{ required: true }}
                />
                <Form.Field
                  label="PVM kodas"
                  form={form}
                  fieldName="VATCode"
                  muiProps={{ required: true }}
                />
                <Form.Field
                  label="Adresas"
                  form={form}
                  fieldName="address"
                  muiProps={{ required: true }}
                />
              </div>
              <div className="m-4 w-64 space-y-3 pt-0">
                <Form.Field
                  label="Telefonas"
                  form={form}
                  fieldName="phone"
                  muiProps={{ required: true }}
                />
                <Form.Field
                  label="Kontaktinis asmuo"
                  form={form}
                  fieldName="contactPerson"
                  muiProps={{ required: true }}
                />
                <Form.Field
                  label="El. paštas"
                  form={form}
                  fieldName="email"
                  muiProps={{ required: true }}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <SubmitButton isSubmitting={customerCreate.isLoading}>
                Kurti naują
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomerCreateDialog;
