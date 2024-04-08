/**
 * ROTATION:
 * This command is designed to fetch and display the current rotation of maps in Brawl Stars, including both ongoing and upcoming maps. 
 * It utilizes the BrawlStarsService to retrieve the latest map rotation data and then formats this data into a visually appealing and informative embed message using the EmbedBuilder from discord.js.
 * 
 * @function createEmbed
 * @param {string} title - The title of the embed message, indicating whether the maps are ongoing or upcoming.
 * @param {BrawlStarsMapDto[]} maps - An array of BrawlStarsMapDto objects representing the maps in the rotation.
 * @param {boolean} isOngoing - A boolean flag indicating whether the maps are currently ongoing or upcoming.
 * @returns {EmbedBuilder} - Returns an EmbedBuilder object with the formatted map rotation information.
 * 
 * @function convertTimestamp
 * @param {string} timestamp - The timestamp string representing the start or end time of a map event.
 * @returns {Date} - Returns a Date object representing the converted timestamp in the "Europe/Berlin" timezone.
 * 
 * @function Command
 * @param {Object} options - An object containing the command's name, description, and run function.
 * @property {string} name - The name of the command, "rotation".
 * @property {string} description - A brief description of the command's functionality.
 * @property {Function} run - The asynchronous function that executes the command, fetching map rotation data and sending the formatted embed message.
 * 
 * @example
 * // Example usage of the rotation command
 * // Assuming the command is already registered and the bot is running
 * // Users can invoke the command by typing "/rotation" in the Discord server where the bot is active.
 * // The bot will then fetch the current map rotation data and display it in an embed message, showing both ongoing and upcoming maps.
 */

import { Command } from "../../structures/Command";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service";
import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "../../static/Theme";
import { ErrorMessages } from "../../static/Error";
import { Converters } from "../../static/Converters";
import { client } from "../..";
import moment = require("moment-timezone");
import { BrawlStarsMapDto } from "../../../core/dto/brawlstars/Map.dto";
import { Constants } from "../../static/Contants";

function createEmbed(title: string, maps: BrawlStarsMapDto[], isOngoing: boolean) {
const embed = new EmbedBuilder()
    .setColor(ColorCodes.primaryColor)
    .setTitle(title)
    .setThumbnail(Constants.timerGif)
    .setFooter({ text: "Central European Summer Time" })
    .setTimestamp();

maps.forEach((map) => {
    let name = Converters.capitalizeFirstLetter(map.event.map);
    const emoji = client.emojis.cache.find(e => e.name === map.event.mode.toUpperCase());
    if (emoji) name = `${emoji} ${name}`;

    const date = convertTimestamp(isOngoing ? map.endTime : map.startTime);
    const formattedDate = moment(date).format('DD MMM HH:mm');

    const value = isOngoing ? `Until ${formattedDate}` : `Arrives on ${formattedDate}`;

    embed.addFields({
        name,
        value,
        inline: true,
    });
});

return embed;
}

function convertTimestamp(timestamp: string): Date {
    const momentObj = moment.utc(timestamp, "YYYYMMDDHHmmss");
    return momentObj.tz("Europe/Berlin").toDate();
}

export default new Command({
    name: "rotation",
    description: "Check Brawl Stars Rotation of Maps",
    run: async ({ interaction }) => {
        const brawlStarsMaps = await BrawlStarsService.instance.getRotation();
        var embeds: EmbedBuilder[] = []

        if (brawlStarsMaps.length < 1) {
            return interaction.followUp({ embeds: [ErrorMessages.getDefaultErrorEmbeddedMessage()] });
        }

        const currenttime = moment().tz('Europe/Berlin').toDate();

        const onGoingMaps = brawlStarsMaps.filter((m) => {
            return convertTimestamp(m.startTime).getTime() <= currenttime.getTime()
        });
        const upComingMaps = brawlStarsMaps.filter((m) => convertTimestamp(m.startTime).getTime() > currenttime.getTime());

        embeds.push(createEmbed('Ongoing Rotation of Maps', onGoingMaps, true));
    
        if (upComingMaps.length > 1) {
            embeds.push(createEmbed('Upcoming Rotation of Maps', upComingMaps, false));
        }

        interaction.followUp({ embeds: embeds });
    }
});
