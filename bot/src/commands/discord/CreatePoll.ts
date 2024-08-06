import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  GuildChannel,
  TextChannel,
} from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { collectMessage } from "../../static/Converters";
import { BBEmbedButton } from "../../core/classes/embed-button";
import { ColorCodes } from "../../static/Theme";

export default new Command({
  name: "poll",
  description: "Help of all commands",

  category: CommandTypes.OTHER,
  options: [
    {
      name: "title",
      description: "Title of the poll",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Channel to send the poll",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "role",
      description: "Role",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    const title = interaction.options.get("title")?.value?.toString();
    const channelId = interaction.options.get("channel")?.value?.toString();
    const roleId = interaction.options.get("role")?.value?.toString();

    if (!title || !channelId) {
      return await interaction.editReply({
        content: "Please provide a title and channel for the poll.",
      });
    }

    const channel = interaction.guild?.channels.cache.get(channelId);

    if (!channel || !(channel instanceof TextChannel)) {
      return await interaction.editReply({
        content: "Channel not found.",
      });
    }

    await interaction.editReply({
      content:
        "Please provide a description for the poll. Type `skip` to skip this step.",
    });

    const response = await collectMessage(interaction);
    const description = response?.content ?? "skip";
    await response?.delete();

    if (!channel) {
      return await interaction.editReply({
        content: "Channel not found.",
      });
    }

    const embed = new EmbedBuilder();
    embed.setColor(ColorCodes.primaryColor);
    embed.setTitle(title);

    const explanation = "**Vote:**\n👍 = Yes\n🤷 = Why not ?\n👎 = No";
    if (description !== "skip") {
      embed.setDescription(`${description}\n\n${explanation}`);
    } else {
      embed.setDescription(explanation);
    }

    const thumbsUpButton = new BBEmbedButton("👍", "yes", ButtonStyle.Success);
    const shrugButton = new BBEmbedButton("🤷", "shrug", ButtonStyle.Primary);
    const thumbsDownButton = new BBEmbedButton("👎", "no", ButtonStyle.Danger);
    const viewVotesButton = new BBEmbedButton("👀 Votes", "view-votes");
    const openThreadButton = new BBEmbedButton("🧵 Open Thread", "open-thread");

    const bbButtons = [
      thumbsUpButton,
      shrugButton,
      thumbsDownButton,
      viewVotesButton,
      openThreadButton,
    ];
    const buttons = bbButtons.map((button) => button.button);

    const component = new ActionRowBuilder<ButtonBuilder>().setComponents(
      buttons
    );

    var content = undefined;
    if (roleId) {
      content = `<@&${roleId}>`;
    }

    const message = await channel.send({
      content: content,
      embeds: [embed],
      components: [component],
    });

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => message.id === i.message.id,
    });

    collector.on("collect", async (buttonInteraction) => {
      const buttonPressed = bbButtons.find(
        (b) => b.customId === buttonInteraction.customId
      );

      if (buttonPressed) {
        await buttonInteraction.deferUpdate();
        await buttonInteraction.followUp({
          content: `You voted ${buttonPressed.displayName}`,
          ephemeral: true,
        });
      }
    });

    await interaction.editReply({
      content: `Poll created successfully. You can view it in <#${channelId}>.`,
    });
  },
});
