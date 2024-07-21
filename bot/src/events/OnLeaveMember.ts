import { ChannelType, Guild, VoiceChannel } from "discord.js";
import { Event } from "../structures/Event";
import { HttpService } from "../core/services/HttpService";
import { WelcomeMessage } from "../core/dto/discord/WelcomeMessage";

export default new Event("guildMemberRemove", async (member) => {
  const welcome = await HttpService.instance.get<WelcomeMessage>(
    `/discord/guilds/${member.guild.id}/member-count`
  );

  const memberCountChannel = member.guild.channels.cache.find(
    (channel) => channel.id == welcome.channelId
  );

  if (memberCountChannel && memberCountChannel instanceof VoiceChannel) {
    memberCountChannel.setName(`Members: ${member.guild.memberCount}`);
  }
});
