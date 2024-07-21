import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { HttpService } from "../../core/services/HttpService";

export default new Command({
  name: "set-member-count",
  description: "Set member count channel",
  category: CommandTypes.MEMBER_COUNT,
  run: async ({ interaction }) => {
    const guild = interaction.guild;

    if (!guild) return;

    try {
      await guild.channels
        .create({
          name: `Members: ${guild.memberCount}`,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: ["Connect", "Speak"],
            },
          ],
        })
        .then(async (channel) => {
          await HttpService.instance.post(
            `/discord/guilds/${guild.id}/member-count`,
            { channelId: channel.id }
          );
        });

      await interaction.followUp({
        content: "Member count channel has been set!",
        ephemeral: true,
      });
    } catch {
      await interaction.followUp({
        content: "Failed to set member count channel!",
        ephemeral: true,
      });
    }
  },
});
