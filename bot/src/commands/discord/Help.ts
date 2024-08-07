import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { CommandTypes } from "../../typings/Command";
import { BBEmbedButton } from "../../core/classes/embed-button";
import { discordClient } from "../..";

export default new Command({
  name: "help",
  description: "Help of all commands",
  category: CommandTypes.OTHER,
  run: async ({ interaction }) => {
    const commandButtons = Object.values(CommandTypes).map((type) => {
      return new BBEmbedButton(type.toString(), type.toString());
    });

    // Limit buttons to 5
    const buttons = commandButtons.map((button) => button.button).slice(0, 5);

    const component = new ActionRowBuilder<ButtonBuilder>().setComponents(
      buttons
    );

    const embed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setFields({
        name: "Select a category to view commands",
        value:
          "Click one of the buttons below to view commands in that category.",
      })
      .setTitle("Help")
      .setTimestamp();

    await interaction.followUp({ embeds: [embed], components: [component] });

    if (interaction.channel) {
      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id == interaction.user.id,
        time: 30000,
        max: 1,
      });

      collector.on("collect", async (buttonInteraction) => {
        const buttonPressed = commandButtons.find(
          (cb) => cb.customId == buttonInteraction.customId
        );

        const id = buttonPressed?.id;

        if (id) {
          const commandEmbed = new EmbedBuilder()
            .setColor(ColorCodes.primaryColor)
            .setTitle(id)
            .setFooter({
              text: "⚠️ indicates that you do not have permission to use this command",
            })
            .setTimestamp();

          const commands = discordClient.commands.filter(
            (c) => c.category == id
          );

          commands.map((m) => {
            var name = `/${m.name}`;
            if (
              m.userPermission &&
              !interaction.memberPermissions?.has(m.userPermission)
            ) {
              name = "⚠️ " + name;
            }
            commandEmbed.addFields({
              name: name,
              value: m.description,
            });
          });

          await buttonInteraction.update({
            embeds: [commandEmbed],
            components: [],
          });
        }
      });
    }
  },
});
