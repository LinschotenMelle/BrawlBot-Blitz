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

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service";
import { DatabaseService } from "../../../core/services/Database-serivce";
import { ErrorMessages } from "../../static/Error";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";

export default new Command({
    name: "profile",
    options: [{
        name: "tag",
        description: "A Brawl Stars Tag",
        type: ApplicationCommandOptionType.String,
    }],
    description: "Check Brawl Stars Rotation of Maps",
    run: async ({ interaction }) => {
        let tag = interaction.options.get('tag')?.value?.toString();
        
        if (!tag) { 
            const profiles = await DatabaseService.instance.astraDb.collection("profiles");

            const user = await profiles.findOne({
                'id': interaction.user.id
            })

            if (!user) return interaction.followUp({ embeds: [ErrorMessages.getDefaultErrorEmbeddedMessage('Your account has not been registered yet...')] });

            tag = user.tag;
        } else {
            if (tag[0] != '#') return interaction.followUp({embeds: [ErrorMessages.getDefaultInvalidTypeEmbeddedMessage()] });
            
            tag = tag.replace("#", "%23").trim();
        }

        const profile = await BrawlStarsService.instance.getProfileByTag(`${tag}`);

        if (!profile) return interaction.followUp({ embeds: [ErrorMessages.getDefaultErrorEmbeddedMessage()] });

        const embed = new EmbedBuilder()
        .setColor(ColorCodes.primaryColor)
        .setTitle(`${profile.name} - ${profile.tag}`)
        .setFields({ name: 'Highest trophies', value: `${profile.highestTrophies}` })
        .setTimestamp();

        return interaction.followUp({ embeds: [embed] });
    }
});