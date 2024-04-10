/**
 * SAVE:
 * This command allows users to set their Brawl Stars tag, which is essential for fetching and displaying their Brawl Stars profile information.
 * The command uses the BrawlStarsService to validate the provided tag and retrieve the user's profile data. If the tag is valid and a profile is found,
 * the command saves the user's tag in the database using the DatabaseService. This ensures that the user's Brawl Stars profile can be easily accessed and updated.
 *
 * @function Command
 * @param {Object} options - An object containing the command's name, description, options, and run function.
 * @property {string} name - The name of the command, "save".
 * @property {string} description - A brief description of the command's functionality.
 * @property {Array} options - An array of options for the command, including the "tag" option which is required and of type string.
 * @property {Function} run - The asynchronous function that executes the command, validating the tag, fetching the profile, and saving the tag in the database.
 *
 * @example
 * // Example usage of the save command
 * // Assuming the command is already registered and the bot is running
 * // Users can invoke the command by typing "/save tag=YOUR_BRAWL_STARS_TAG" in the Discord server where the bot is active.
 * // The bot will then validate the tag, fetch the user's profile, and save the tag in the database. If successful, it will send a confirmation message.
 */

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { ErrorMessages } from "../../static/Error";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service";
import { DatabaseService } from "../../../core/services/Database-serivce";
import { ColorCodes } from "../../static/Theme";

export default new Command({
  name: "save",
  description: "Set your Brawl Stars Tag",
  options: [
    {
      name: "tag",
      description: "Your Brawl Stars Tag  ",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    const tag = interaction.options.data[0].value?.toString();

    if (!tag || tag[0] != "#")
      return interaction.followUp({
        embeds: [ErrorMessages.getDefaultInvalidTypeEmbeddedMessage()],
        ephemeral: true,
      });

    const hashedTag = tag.replace("#", "%23").trim();

    const profile = await BrawlStarsService.instance.getProfileByTag(hashedTag);

    if (!profile)
      return interaction.followUp({
        embeds: [
          ErrorMessages.getDefaultErrorEmbeddedMessage(
            `No player found with tag: ${tag}`
          ),
        ],
        ephemeral: true,
      });

    // Save in DB
    const profiles = await DatabaseService.instance.astraDb.collection(
      "profiles"
    );
    const userProfile = await profiles.findOne({
      id: interaction.user.id,
    });

    if (!userProfile) {
      await profiles.insertOne({
        id: interaction.user.id,
        tag: hashedTag,
      });
    } else {
      await profiles.updateOne(
        {
          id: interaction.user.id,
        },
        {
          $set: { tag: hashedTag },
        }
      );
    }

    const embed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setTitle(`Thanks for registering ${profile.name} - ${profile.tag}`)
      .setTimestamp();

    return interaction.followUp({ embeds: [embed] });
  },
});
