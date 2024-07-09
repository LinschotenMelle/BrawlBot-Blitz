import { Event } from "../structures/Event";
import { YoutubeService } from "../core/services/YoutubeService";

export default new Event("ready", async () => {
  console.log("Bot is online");
  await YoutubeService.initialize();
});
