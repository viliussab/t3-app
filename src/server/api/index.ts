import { createRouter } from "./context";
import superjson from "superjson";
import { mapsRouter } from "./area";
import { billboardTypesRouter } from "./billboardTypeApi";
import { billboardRouter } from "./billboardApi";
import { customerRouter } from "./customerApi";
import { campaignRouter } from "./campaignApi";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("area.", mapsRouter)
  .merge("billboard.", billboardRouter)
  .merge("billboardType.", billboardTypesRouter)
  .merge("customer.", customerRouter)
  .merge("campaign.", campaignRouter);
  
export type AppRouter = typeof appRouter;
