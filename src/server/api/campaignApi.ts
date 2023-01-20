import { createRouter } from "./context";
import { campaignCreateSchema } from "../../types/command/campaignCreate.schema";
import { getByIdSchema } from "../../types/filters/getById.schema";
import pdfGenerator from "../html/pdfGenerator";

import { Blob } from "buffer";
import fs from "fs";
import path from "path";
import HtmlTemplate from "../html/HtmlTemplate";
import { Base64File } from "../../types/dto/Base64File";

export const campaignRouter = createRouter()

  .mutation("create", {
    input: campaignCreateSchema,
    async resolve({ ctx, input }) {
      const campaign = await ctx.prisma.campaign.create({
        data: {
          ...input
        }
      });
  
      return { campaign };
    }
  })
  .query("generatePdf", {
    input: getByIdSchema,
    async resolve({ ctx, input }) {
      const html = fs.readFileSync("./src/server/html/order/template.html", "utf8");

      const buildedHtml = new HtmlTemplate(html)
        .replace("DateNow", "2022-12-12")
        .getResult();

      console.log("what", "1");

      const pdfBuffer = await pdfGenerator.buildAsync(buildedHtml);

      const file = {
        contentType: "application/pdf",
        data: pdfBuffer.toString("base64"),
        fileName: "order.pdf"
      } as Base64File;

      return file;
    }
  })
  .query("getAll", {
    async resolve({ctx}) {
      const campaigns = await ctx.prisma.campaign.findMany({
        include: {
          customer: true
        }
      });

      return campaigns;
    }
  })
  .query("getById", {
    input: getByIdSchema,
    async resolve({ctx, input}) {
      const campaign = await ctx.prisma.campaign.findFirst({
        where: {
          id: input.id
        }
      });

      return campaign;
    }
  });
