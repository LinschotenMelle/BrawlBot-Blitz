import { TextChannel } from "discord.js";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", (member) => {
  member.send("Welcome to the server!");

  const logChannel = member.guild.channels.cache.find(
    (channel) => channel.id == process.env.TEST_CHANNEL_ID
  );

  if (!logChannel || !(logChannel instanceof TextChannel)) {
    return console.log("Log channel not found!");
  }

  logChannel.send(`Welcome to the server, ${member}!`);
});
