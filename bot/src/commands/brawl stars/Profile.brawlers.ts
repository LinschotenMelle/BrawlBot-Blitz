import { EmbedBuilder } from "discord.js";
import { PlayerDto } from "../../client";
import { ColorCodes } from "../../static/Theme";
import { Constants } from "../../static/Contants";
import { discordClient } from "../..";
import { Converters } from "../../static/Converters";

export function paginatedBrawlersEmbed(
  profile: PlayerDto,
  page: number,
  pageSize: number,
  totalPages: number
): EmbedBuilder {
  const brawlersEmbed = new EmbedBuilder()
    .setColor(ColorCodes.primaryColor)
    .setTitle(`${profile.name} - ${profile.tag}`)
    .setThumbnail(Constants.logo.name)
    .setFooter({ text: "Page: " + (page + 1) + "/" + totalPages })
    .setTimestamp();

  if (!profile.brawlers) {
    return brawlersEmbed.setDescription("No brawlers found!");
  }

  const paginatedBralwers = profile.brawlers
    .sort((a, b) => b.trophies - a.trophies)
    .slice(page * pageSize, page * pageSize + pageSize);

  paginatedBralwers.forEach((brawler) => {
    const brawlerEmoji = discordClient.emojis.cache.find(
      (e) => e.name === brawler.name.replace(/[ &-.]/g, "")
    );
    const convertedName = Converters.capitalizeFirstLetter(brawler.name);
    const name = brawlerEmoji
      ? `${brawlerEmoji} ${convertedName}`
      : convertedName;

    const rankEmoji = discordClient.emojis.cache.find(
      (e) => e.name === `Rank_${calculateRank(brawler.highestTrophies)}`
    );

    const convertedValue = `${brawler.trophies}/${brawler.highestTrophies}`;
    const value = rankEmoji ? `${rankEmoji} ${convertedValue}` : convertedValue;

    brawlersEmbed.addFields({
      name: `${name} (L. ${brawler.power})`,
      value: value,
      inline: true,
    });
  });

  return brawlersEmbed;
}

function calculateRank(trophies: number): number {
  // Define the trophy requirements for each rank
  const trophyRequirements = [
    0, 10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 220, 260, 300, 340, 380,
    420, 460, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050,
    1100, 1150, 1200, 1250,
  ];

  const v = trophyRequirements.findIndex((t) => trophies < t);

  if (v == -1) {
    return 35;
  }

  return v;
}
