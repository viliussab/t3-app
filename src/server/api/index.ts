import { createRouter } from "./context";
import superjson from "superjson";
import { mapsRouter } from "./area";
import { billboardTypesRouter } from "./billboardType";
import { billboardRouter } from "./billboard";
import { customerRouter } from "./customer";
import { campaignRouter } from "./campaign";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("area.", mapsRouter)
  .merge("billboard.", billboardRouter)
  .merge("billboardType.", billboardTypesRouter)
  .merge("customer.", customerRouter)
  .merge("campaign.", campaignRouter);
  
export type AppRouter = typeof appRouter;
