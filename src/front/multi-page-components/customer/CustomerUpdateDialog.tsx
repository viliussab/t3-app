import * as RHF from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as NextRouter from "next/router";
import Components from "../../components";
import { trpc } from "../../../utils/trpc";
import { CustomerUpdate, customerUpdateSchema } from "../../../types/command/customerUpdate.schema";
import Form from "../../components/form";
import { Customer } from "@prisma/client";
import { Dialog } from "@mui/material";

type CustomerUpdateDialogProps = {
  customer: Customer,
  open: boolean,
  onClose: () => void
}

const CustomerUpdateDialog = ({customer, open, onClose} : CustomerUpdateDialogProps) => {
  const router = NextRouter.useRouter();
  
  const customerCreate = trpc.useMutation(
    ["customer.update"], 
    {
      onSuccess: () => {
        router.reload();
      }
    });
  
  const form = RHF.useForm<CustomerUpdate>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      ...customer
    }
  });
  
  const submitBillboard = (values : CustomerUpdate) => {
    customerCreate.mutate(values);
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <Components.Layout>
        <div className="flex justify-center">
          <Components.Paper className="m-4 p-4 bg-gray-50">
            <div className="text-center text-xl font-semibold">
                Keisti kliento duomenis
            </div>
            <form onSubmit={(e) => { 
              form.handleSubmit(submitBillboard)(e);
            }}>
              <div className="flex justify-center">
                <div className="w-64 pt-0 m-4 space-y-3">
                  <Form.Field
                    label='Kompanijos pavadinimas'
                    form={form}
                    fieldName="name"
                    muiProps={{required: true}}
                  />
                  <Form.Field
                    label='Įmonės kodas'
                    form={form}
                    fieldName="companyCode"
                    muiProps={{required: true}}
                  />
                  <Form.Field
                    label='PVM kodas'
                    form={form}
                    fieldName="VATCode"
                    muiProps={{required: true}}
                  />
                  <Form.Field
                    label='Adresas'
                    form={form}
                    fieldName="address"
                    muiProps={{required: true}}
                  />
                </div>
                <div className="w-64 pt-0 m-4 space-y-3">
                  <Form.Field
                    label='Telefonas'
                    form={form}
                    fieldName="phone"
                    muiProps={{required: true}}
                  />
                  <Form.Field
                    label='Kontaktinis asmuo'
                    form={form}
                    fieldName="contactPerson"
                    muiProps={{required: true}}
                  />
                  <Form.Field
                    label='El. paštas'
                    form={form}
                    fieldName="email"
                    muiProps={{required: true}}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Components.SubmitButton isSubmitting={customerCreate.isLoading}>Atnaujinti</Components.SubmitButton>
              </div>
            </form>
          </Components.Paper>
        </div>
      </Components.Layout>
    </Dialog>
  );
};    
  
export default CustomerUpdateDialog;
