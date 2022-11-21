import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { appRouter } from "../../../server/api";
import { createContext } from "../../../server/api/context";

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
        // eslint-disable-next-line no-console
        console.error(`❌ tRPC failed on ${path}: ${error}`);
      }
      : undefined
});
