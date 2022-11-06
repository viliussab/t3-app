import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { mapsRouter } from "./area";
import { billboardTypesRouter } from "./billboardType";
import { billboardRouter } from "./billboard";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("area.", mapsRouter)
  .merge("billboard.", billboardRouter)
  .merge("billboardType.", billboardTypesRouter);
  
export type AppRouter = typeof appRouter;
