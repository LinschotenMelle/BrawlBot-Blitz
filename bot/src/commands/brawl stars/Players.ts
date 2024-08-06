import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import {
  brawlStarsControllerGetClubs,
  brawlStarsControllerGetPlayers,
} from "../../client";
import { ErrorMessages } from "../../static/Error";
import { ColorCodes } from "../../static/Theme";
import { Constants } from "../../static/Contants";
import { Emojis } from "../../static/Emojis";
import { discordClient } from "../..";

export default new Command({
  name: "players",
  description: "Check the top players of Brawl Stars based on country",
  category: CommandTypes.BRAWL_STARS,
  options: [
    {
      name: "country",
      description: "The country code of the country you want to check",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    const countryCode = interaction.options.get("country")?.toString() ?? "NL";
    const response = await brawlStarsControllerGetPlayers({
      query: {
        countryCode,
      },
    });
    const players = response.data;

    if (!players.length) {
      return interaction.reply({
        content: ErrorMessages.noPlayersFound,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setTitle("Top Clubs")
      .setThumbnail(Constants.logo.name)
      .setFooter({ text: "Brawl Stars" })
      .setTimestamp();

    const emojis = Emojis.getInstance(discordClient);

    players.forEach((player, index) => {
      embed.addFields({
        name: `No ${index + 1} - ${player.name}`,
        value: `${emojis.trophy} Trophies: ${player.trophies} \n ${emojis.clubs} Club: ${player.club?.name}`,
        inline: true,
      });
    });

    return interaction.followUp({ embeds: [embed] });
  },
});
