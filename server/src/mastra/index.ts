import { Mastra } from "@mastra/core";
import { clickSafeAgent } from "./agent/clickSafeAgent";
import { LibSQLStore } from "@mastra/libsql";
import { clickSafeRoute } from "../routes/click-safe.routes";

export const mastra = new Mastra({
    server: {
        apiRoutes: [clickSafeRoute]
    },
    agents: { clickSafeAgent },
    storage: new LibSQLStore({
        // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
        url: ":memory:",
    }),
    bundler: {
        externals: ["@whoisjson/whoisjson"],
    },

    telemetry: {
        // Telemetry is deprecated and will be removed in the Nov 4th release
        enabled: false,
    },
    observability: {
        // Enables DefaultExporter and CloudExporter for AI tracing
        default: { enabled: true },
    },
});
