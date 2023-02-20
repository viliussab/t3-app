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
import CustomerCUDialog from "./CustomerCUDialog";

type CustomerCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  submitText: string;
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
    <CustomerCUDialog
      form={form}
      isSubmitting={customerCreate.isLoading}
      onClose={onClose}
      onSubmit={submitBillboard}
      open={open}
      submitText="Kurti naują"
      title="Kurti klientą"
    />
  );
};

export default CustomerCreateDialog;
