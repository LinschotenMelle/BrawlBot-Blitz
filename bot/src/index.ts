require("dotenv").config();
import * as Sentry from "@sentry/browser";
import { ExtendedClient } from "./structures/Client";
import DiscordAnalytics from "discord-analytics/discordjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
export const client = new ExtendedClient();
export const analytics = new DiscordAnalytics({
  client: client,
  apiToken: process.env.ANALYTICS_TOKEN ?? "",
  sharded: false,
});
client.start();
