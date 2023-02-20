import { CustomerCreate } from "../../../types/command/customerCreate.schema";
import * as RHF from "react-hook-form";
import Form from "../../components/form";
import { Dialog } from "@mui/material";
import SubmitButton from "../../components/form/SubmitButton";

type CustomerCUDialogProps<TCustomer extends CustomerCreate> = {
  open: boolean;
  onClose: () => void;
  submitText: string;
  title: string;
  onSubmit: (values: TCustomer) => void;
  form: RHF.UseFormReturn<TCustomer>;
  isSubmitting: boolean;
};

const CustomerCUDialog = <TCustomer extends CustomerCreate>({
  open,
  onClose,
  submitText,
  form,
  title,
  onSubmit,
  isSubmitting,
}: CustomerCUDialogProps<TCustomer>) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex justify-center">
        <div className="bg-gray-50 p-2 pb-4">
          <div className="text-center text-xl font-semibold">{title}</div>
          <form
            onSubmit={(e) => {
              form.handleSubmit(onSubmit)(e);
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
              <SubmitButton isSubmitting={isSubmitting}>
                {submitText}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomerCUDialog;
