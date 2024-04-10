/**
 * PROFILE:
 * This command allows users to check their Brawl Stars profile information by providing their Brawl Stars tag.
 * If no tag is provided, the command attempts to retrieve the user's saved tag from the database. The command then uses the BrawlStarsService to fetch the player's profile data, including their highest trophies, and displays this information in an embed message.
 *
 * @function Command
 * @param {Object} options - An object containing the command's name, description, options, and run function.
 * @property {string} name - The name of the command, "profile".
 * @property {string} description - A brief description of the command's functionality.
 * @property {Array} options - An array of options for the command, including the "tag" option which is optional and of type string.
 * @property {Function} run - The asynchronous function that executes the command, fetching the player's profile data and sending the formatted embed message.
 *
 * @example
 * // Example usage of the profile command
 * // Assuming the command is already registered and the bot is running
 * // Users can invoke the command by typing "/profile tag=YOUR_BRAWL_STARS_TAG" in the Discord server where the bot is active.
 * // If no tag is provided, the command will attempt to use the user's saved tag from the database.
 * // The bot will then fetch the player's profile data and display it in an embed message, showing their highest trophies.
 */

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service";
import { DatabaseService } from "../../../core/services/Database-serivce";
import { ErrorMessages } from "../../static/Error";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { Constants } from "../../static/Contants";
import { BrawlStarsPlayer } from "../../../core/dto/brawlstars/Player.dto";
import { Emojis } from "../../static/Emojis";
import { client } from "../..";

export class BBEmbedButton {
  private name!: string;
  private customID!: string;
  private style!: ButtonStyle;
  private isEnabled!: boolean;

  constructor(
    name: string,
    customId: string,
    style: ButtonStyle = ButtonStyle.Primary,
    initialDisabled: boolean = true
  ) {
    this.name = name;
    this.customID = customId;
    this.style = style;
    this.isEnabled = initialDisabled;
  }

  enabled(isEnabled: boolean = true): void {
    this.isEnabled = isEnabled;
  }

  private get _customId(): string {
    return `${this.customID}_${this.name}`;
  }

  public get button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(this._customId)
      .setLabel(this.name)
      .setStyle(this.style ?? ButtonStyle.Primary)
      .setDisabled(!this.isEnabled);
  }

  public get customId(): string {
    return this._customId;
  }
}

function paginatedBrawlersEmbed(
  profile: BrawlStarsPlayer,
  page: number,
  pageSize: number,
  totalPages: number,
  emojis: Emojis
): EmbedBuilder {
  const brawlersEmbed = new EmbedBuilder()
    .setColor(ColorCodes.primaryColor)
    .setTitle(`${profile.name} - ${profile.tag}`)
    .setThumbnail(Constants.logo.name)
    .setFooter({ text: "Page: " + (page + 1) + "/" + totalPages })
    .setTimestamp();

  profile.brawlers
    .sort((a, b) => b.trophies - a.trophies)
    .slice(page * pageSize, page * pageSize + pageSize)
    .forEach((brawler) => {
      const emoji = client.emojis.cache.find((e) => e.name === brawler.name);
      const name = emoji ? `${emoji} ${brawler.name}` : brawler.name;

      brawlersEmbed.addFields({
        name: name,
        value: `${emojis.trophy} ${brawler.trophies}/${brawler.highestTrophies}`,
        inline: true,
      });
    });

  return brawlersEmbed;
}

export default new Command({
  name: "profile",
  options: [
    {
      name: "tag",
      description: "A Brawl Stars Tag",
      type: ApplicationCommandOptionType.String,
    },
  ],
  description:
    "Check Your Brawl Stars Profile based of your saved tag or the tag you provide.",
  run: async ({ interaction }) => {
    const emojis = Emojis.getInstance(client);
    let tag = interaction.options.get("tag")?.value?.toString();

    if (!tag) {
      const profiles = await DatabaseService.instance.astraDb.collection(
        "profiles"
      );

      const user = await profiles.findOne({
        id: interaction.user.id,
      });

      if (!user)
        return interaction.followUp({
          embeds: [
            ErrorMessages.getDefaultErrorEmbeddedMessage(
              "Your account has not been registered yet..."
            ),
          ],
          ephemeral: true,
        });

      tag = user.tag;
    } else {
      if (tag[0] != "#")
        return interaction.followUp({
          embeds: [ErrorMessages.getDefaultInvalidTypeEmbeddedMessage()],
          ephemeral: true,
        });

      tag = tag.replace("#", "%23").trim();
    }

    const profile = await BrawlStarsService.instance.getProfileByTag(`${tag}`);
    const brawlers = await BrawlStarsService.instance.getBrawlers();

    if (!profile)
      return interaction.followUp({
        embeds: [ErrorMessages.getDefaultErrorEmbeddedMessage()],
        ephemeral: true,
      });

    let clubValue = "Not in a club";

    if (profile.club != undefined && Object.keys(profile.club).length > 0) {
      clubValue = `[${
        profile.club!.name
      }](https://brawlify.com/stats/club/${profile.club!.tag.replaceAll(
        "#",
        ""
      )})`;
    }

    const embed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setTitle(`${profile.name} - ${profile.tag}`)
      .setFields(
        {
          name: `${emojis.trophy} Trophies`,
          value: `${profile.trophies}/${profile.highestTrophies}`,
        },
        { name: `${emojis.clubs} Club`, value: clubValue },
        {
          name: `${emojis.brawlers} Brawlers`,
          value: `${profile.brawlers.length}/${brawlers.length}`,
        },
        {
          name: `${emojis.soloVictories} Solo Victories`,
          value: `${profile.soloVictories}`,
          inline: true,
        },
        {
          name: `${emojis.duoVictories} Duo Victories`,
          value: `${profile.duoVictories}`,
          inline: true,
        },
        {
          name: `${emojis.threeVsThreeVictories} 3v3 Victories`,
          value: `${profile["3vs3Victories"]}`,
          inline: true,
        },
        {
          name: `${emojis.info} Experience Level`,
          value: `${profile.expLevel}`,
          inline: true,
        },
        {
          name: `${emojis.info} Experience Points`,
          value: `${profile.expPoints}`,
          inline: true,
        }
      )
      .setFooter({ text: "Brawl Stars Profile" })
      .setThumbnail(Constants.logo.name)
      .setTimestamp();

    const brawlersButton = new BBEmbedButton(
      "Brawlers",
      `${interaction.user.id}_${interaction.channelId}_${tag}_${Date.now()}`
    );
    const profileComponent =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        brawlersButton.button
      );

    const message = await interaction.followUp({
      embeds: [embed],
      components: interaction.channel ? [profileComponent] : [],
      files: [Constants.logo.attachment],
    });

    const backButton = new BBEmbedButton(
      "Back",
      `${interaction.user.id}_${message.id}_${interaction.channelId}_${tag}`,
      ButtonStyle.Danger
    );
    const moreButton = new BBEmbedButton(
      ">",
      `${interaction.user.id}_${message.id}_${interaction.channelId}_${tag}`,
      ButtonStyle.Secondary
    );
    const lessButton = new BBEmbedButton(
      "<",
      `${interaction.user.id}_${message.id}_${interaction.channelId}_${tag}`,
      ButtonStyle.Primary,
      false
    );

    if (interaction.channel) {
      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id == interaction.user.id,
      });

      let page = 0;
      const pageSize = 24;
      const totalPages = Math.ceil(profile.brawlers.length / pageSize);
      collector.on("collect", async (i) => {
        const id = brawlersButton.customId.split("_")[0];

        if (i.user.id !== id) {
          await i.reply({
            content: "You are not allowed to interact with this message.",
            ephemeral: true,
          });
        }

        if (
          i.user.id == interaction.user.id &&
          i.customId === brawlersButton.customId
        ) {
          await i.update({
            embeds: [
              paginatedBrawlersEmbed(
                profile,
                page,
                pageSize,
                totalPages,
                emojis
              ),
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                backButton.button,
                lessButton.button,
                moreButton.button
              ),
            ],
          });
        }

        if (
          i.user.id == interaction.user.id &&
          i.customId === moreButton.customId
        ) {
          page++;
          lessButton.enabled(page != 0);
          moreButton.enabled(page != totalPages - 1);
          await i.update({
            embeds: [
              paginatedBrawlersEmbed(
                profile,
                page,
                pageSize,
                totalPages,
                emojis
              ),
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                backButton.button,
                lessButton.button,
                moreButton.button
              ),
            ],
          });
        }

        if (
          i.user.id == interaction.user.id &&
          i.customId === lessButton.customId
        ) {
          page--;
          lessButton.enabled(page != 0);
          moreButton.enabled(page != totalPages - 1);
          await i.update({
            embeds: [
              paginatedBrawlersEmbed(
                profile,
                page,
                pageSize,
                totalPages,
                emojis
              ),
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                backButton.button,
                lessButton.button,
                moreButton.button
              ),
            ],
          });
        }

        if (
          i.user.id == interaction.user.id &&
          i.customId === backButton.customId
        ) {
          await i.update({ embeds: [embed], components: [profileComponent] });
        }
      });
    }
  },
});
