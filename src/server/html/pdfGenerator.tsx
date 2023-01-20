import puppeteer from "puppeteer";

const buildAsync = async (html: string) => {
  const browser = await puppeteer.launch({ args: ["--allow-file-access-from-files", "--enable-local-file-accesses"] });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  await page.emulateMediaType("screen");

  const pdf = await page.pdf({
    printBackground: true,
    path: "tempName.pdf",
    printBackground: true,
    margin: {
      bottom: "2.97cm",
      top: "2.97cm",
      left: "2.1cm",
      right: "2.1cm"
    },
    format: "A4"
  });

  await browser.close();

  return pdf;
};

const pdfGenerator = {
  buildAsync
};

export default pdfGenerator;
