import { VoiceChannel } from "discord.js";
import { Event } from "../structures/Event";
import { discordControllerGetMemberCount } from "../client";

export default new Event("guildMemberRemove", async (member) => {
  const response = await discordControllerGetMemberCount({
    path: {
      guildId: member.guild.id,
    },
  });
  const memberCount = response.data;

  const memberCountChannel = member.guild.channels.cache.find(
    (channel) => channel.id == memberCount.channelId
  );

  if (memberCountChannel && memberCountChannel instanceof VoiceChannel) {
    memberCountChannel.setName(`Members: ${member.guild.memberCount}`);
  }
});
