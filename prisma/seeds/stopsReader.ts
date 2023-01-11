import * as fs from "fs";
import * as exceljs from "exceljs";

type BillboardExcel = {
    serialCode: string,
    name: string,
    address: string,
    side: string,
    googlePhotoUrl: string,
    longitude: number,
    latitude: number,
}

const readAsync = async () => {
  const file = fs.readFileSync("./prisma/seeds/stops.xlsx");

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(file);

  const sheet = workbook.worksheets.find(sheet => sheet.name === "Sheet1");

  const rows = sheet?.getRows(2, sheet?.rowCount - 1);

  const billboards = rows?.map(row => (
    {
      serialCode: row.getCell(1).value?.toString(),
      name: row.getCell(2).value?.toString(),
      address: row.getCell(3).value?.toString(),
      side: row.getCell(4).value?.toString(),
      googlePhotoUrl: row.getCell(5).value?.toString(),
      longitude: Number(row.getCell(6).value?.toString()),
      latitude: Number(row.getCell(7).value?.toString())
    } as BillboardExcel
  ));

  console.log("sheet", sheet?.rowCount);

  return billboards;
};

const stopsReader = {
  readAsync
};

export default stopsReader;
