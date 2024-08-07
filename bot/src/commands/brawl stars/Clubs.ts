import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandTypes } from "../../typings/Command";
import { Command } from "../../structures/Command";
import { brawlStarsControllerGetClubs } from "../../client";
import { ErrorMessages } from "../../static/Error";
import { ColorCodes } from "../../static/Theme";
import { Constants } from "../../static/Contants";

export default new Command({
  name: "clubs",
  description: "Check the top clubs of Brawl Stars based on country",
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
    const response = await brawlStarsControllerGetClubs({
      query: {
        countryCode,
      },
    });
    const clubs = response.data;

    if (!clubs.length) {
      return interaction.reply({
        content: ErrorMessages.noClubsFound,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setTitle("Top Clubs")
      .setThumbnail(Constants.logo.name)
      .setFooter({ text: "Brawl Stars" })
      .setTimestamp();

    clubs.forEach((club) => {
      embed.addFields({
        name: `No ${club.rank} - ${club.name}`,
        value: `Members: ${club.memberCount} \n Trophies: ${club.trophies} \n Tag: ${club.tag}`,
        inline: true,
      });
    });

    return interaction.followUp({ embeds: [embed] });
  },
});
