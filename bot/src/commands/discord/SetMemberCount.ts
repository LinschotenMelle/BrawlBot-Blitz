import { ChannelType, PermissionFlagsBits } from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { discordControllerPostMemberCount } from "../../client";

export default new Command({
  name: "set-member-count",
  description: "Set member count channel",
  category: CommandTypes.INFO,
  userPermission: [PermissionFlagsBits.ManageGuild],
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
          await discordControllerPostMemberCount({
            path: {
              guildId: guild.id,
            },
            body: {
              channelId: channel.id,
            },
          });
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
