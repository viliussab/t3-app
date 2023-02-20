import * as RHF from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as NextRouter from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  CustomerUpdate,
  customerUpdateSchema,
} from "../../../types/command/customerUpdate.schema";
import { Customer } from "@prisma/client";
import CustomerCUDialog from "./CustomerCUDialog";

type CustomerUpdateDialogProps = {
  customer: Customer;
  open: boolean;
  onClose: () => void;
};

const CustomerUpdateDialog = ({
  customer,
  open,
  onClose,
}: CustomerUpdateDialogProps) => {
  const router = NextRouter.useRouter();

  const customerUpdateCommand = trpc.useMutation(["customer.update"], {
    onSuccess: () => {
      router.reload();
    },
  });

  const form = RHF.useForm<CustomerUpdate>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      ...customer,
    },
  });

  const submitBillboard = (values: CustomerUpdate) => {
    customerUpdateCommand.mutate(values);
    onClose();
  };

  return (
    <CustomerCUDialog
      open={open}
      form={form}
      isSubmitting={customerUpdateCommand.isLoading}
      onSubmit={submitBillboard}
      title="Keisti kliento duomenis"
      onClose={onClose}
      submitText="Atnaujinti"
    />
  );
};

export default CustomerUpdateDialog;
