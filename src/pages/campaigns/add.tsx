import { NextPage } from "next";
import Layout from "../../front/components/Layout";
import { trpc } from "./../../utils/trpc";
import { BillboardGetBySidesDto } from "../../types/billboard.schema";
import Input from "../../front/third-party/Input";
import { CampaignCreate, campaignCreateSchema } from "../../types/campaign.schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextFieldProps } from "@mui/material";
import * as dateFns from "date-fns";

const CreateCampaign: NextPage = () => {

  const billboardQuery = trpc.useQuery(["billboard.getAsSides"]);
  const customersQuery = trpc.useQuery(["customer.getAll"]);

  const now = dateFns.addDays(new Date(), 1);

  const form = useForm<CampaignCreate>({
    resolver: zodResolver(campaignCreateSchema),
    defaultValues: {
      periodStart: now,
      periodEnd: now,
      selectedBillboardIds: []
    }
  });

  const selectedIds = form.watch("selectedBillboardIds");

  if (billboardQuery.isLoading && customersQuery.isLoading) {
    return <>Loading...</>;
  }

  const { errors } = form.formState;

  return (
    <Layout>
      <div className="flex justify-center m-4">
        <div className="w-56 pt-0 m-4 mt-0 space-y-3">
          <Input.TextField
            label='Kodas'
            fullWidth
            required
            variant="filled"
            error={!!errors["campaignName"]}
            helperText={errors["campaignName"] ? errors["campaignName"].message : ""}
            {...form.register("campaignName")}
          />
          <Input.FormControl variant="filled" fullWidth>
            <Input.Label id="demo-simple-select-standard-label">Klientas</Input.Label>
            <Input.Select
              fullWidth
              required
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              {...form.register("customerId")}
            >
              <Input.SelectItem value={""}>
                <em>Nepasirinkta</em>
              </Input.SelectItem>
              {customersQuery.data?.map(customer => 
                <Input.SelectItem key={customer.id} value={customer.id}>{customer.name}</Input.SelectItem>
              )}
            </Input.Select>
          </Input.FormControl>
          <DateFrom form={form} />
          <DateTo form={form} />
        </div>
        <div>
          {
            <>
              <div className="font-semibold text-lg text-center">{`Pasirinktas stotelių kiekis: ${selectedIds.length}`}</div>
              {!!selectedIds.length && (
                <div className="mt-2 overflow-x-auto relative shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-6">
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Miestas
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Kodas
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Pavadinimas
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Adresas
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Pusė
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {billboardQuery.data?.map((billboard, index) => ( 
                        <BillboardTableRow
                          billboard={billboard}
                          index={index}
                          key={billboard.id}/>)
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          }
        </div>
      </div>
      <div className="flex justify-center m-4">
        <div className="w-64 h-64">
          sds
        </div>
      </div>
    </Layout>
  );
};

type BillboardTableRowProps = {
        billboard: BillboardGetBySidesDto,
        index: number,
};

const BillboardTableRow = (props: BillboardTableRowProps) => {
  const {billboard, index} = props;

  <tr 
    className={ 
      `${index % 2 ? "bg-gray-50" : "bg-white"}
    border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-blue-100 hover:cursor-pointer`} >
    <td className="py-4 px-6">
      {billboard.area.locationName}
    </td>
    <td className="py-4 px-6">
      {billboard.serialCode}
    </td>
    <th className="py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
      {billboard.name + " " + billboard.side.name}
    </th>
    <td className="py-4 px-6">
      {billboard.address}
    </td>
    <td className="py-4 px-6">
      {billboard.type.name}
    </td>
    <td className="py-4 px-6">
      {billboard.side.name}
    </td>
  </tr>;
};

type DatePickerProps = {
  form: UseFormReturn<CampaignCreate>
}

const IsNotTuesday = (date: Date) => {
  return date.getDay() !== 2;
};

const ToWeekText = (date: Date) => {
  if (!date) {
    return undefined;
  }

  const week = dateFns.getWeek(date, {
    weekStartsOn: 2
  });

  const year = dateFns.getWeekYear(date, {
    weekStartsOn: 2
  });

  return `${year} m. ${week} sav.`;
};

const DateFrom = (props : DatePickerProps) => {
  const { form } = props;

  const [periodStart, periodEnd] = form.watch(["periodStart", "periodEnd"]);

  const onChange = (newPeriodStart: Date | null) => {
    if (!newPeriodStart) {
      return;
    }

    if (!periodEnd || newPeriodStart > periodEnd) {
      form.setValue("periodEnd", newPeriodStart);
    }

    form.setValue("periodStart", newPeriodStart);
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopDatePicker
      label="Data nuo"
      shouldDisableDate={IsNotTuesday}
      minDate={new Date()}
      value={periodStart}
      onChange={onChange}
      renderInput={(props: TextFieldProps) => {
        return (
          <Input.TextField 
            {...props}
            inputProps={{
              value: ToWeekText(periodStart),
              placeholder: undefined
            }}
            variant="filled"
            required
            fullWidth
            InputLabelProps={{ shrink: !!periodStart }}
          />);
      }}
    />
  </LocalizationProvider>;
};

const DateTo = (props : DatePickerProps) => {
  const { form } = props;

  const [periodStart, periodEnd] = form.watch(["periodStart", "periodEnd"]);

  const onChange = (newPeriodEnd: Date | null) => {
    if (!newPeriodEnd) {
      return;
    }

    form.setValue("periodEnd", newPeriodEnd);
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopDatePicker
      label="Iki"
      shouldDisableDate={IsNotTuesday}
      minDate={periodStart}
      value={periodEnd}
      onChange={onChange}
      renderInput={(props: TextFieldProps) => {
        return (
          <Input.TextField 
            {...props}
            inputProps={{value: ToWeekText(periodEnd)}}
            variant="filled"
            required
            fullWidth
            InputLabelProps={{ shrink: !!periodEnd }}
          />);
      }}
    />
  </LocalizationProvider>;
};

export default CreateCampaign;
