import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { CommandTypes } from "../../core/enums/CommandType";
import { BBEmbedButton } from "../../core/classes/embed-button";
import { client } from "../..";

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

    interaction.followUp({ embeds: [embed], components: [component] });

    const backButton = new BBEmbedButton("Back", "Back", ButtonStyle.Danger);

    if (interaction.channel) {
      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id == interaction.user.id,
      });

      collector.on("collect", (i) => {
        const buttonPressed = commandButtons.find(
          (cb) => cb.customId == i.customId
        );

        const id = buttonPressed?.customId.split("_")[0];

        if (id) {
          const commandEmbed = new EmbedBuilder()
            .setColor(ColorCodes.primaryColor)
            .setTitle(id)
            .setTimestamp();

          const commands = client.commands.filter((c) => c.category == id);
          commands.map((m) => {
            commandEmbed.addFields({
              name: `/${m.name}`,
              value: m.description,
            });
          });

          i.update({ embeds: [commandEmbed], components: [] });
        }
      });
    }
  },
});
