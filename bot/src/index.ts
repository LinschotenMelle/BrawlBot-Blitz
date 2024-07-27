require("dotenv").config();
import * as Sentry from "@sentry/browser";
import { ExtendedClient } from "./structures/Client";

Sentry.init({
  dsn: "https://bddb328dbb2ec515cb81fc6087ad2a63@o4507673082331136.ingest.de.sentry.io/4507673085673552",
  integrations: [],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
export const client = new ExtendedClient();
client.start();
