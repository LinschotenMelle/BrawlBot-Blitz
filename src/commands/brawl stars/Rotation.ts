import { Command } from "../../structures/Command";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service";
import { EmbedBuilder } from "discord.js";
import { ColorCodes, Constants } from "../../static/Theme";
import { ErrorMessages } from "../../static/Error";
import { Converters } from "../../static/Converters";
import { client } from "../..";
import moment = require("moment-timezone");
import { BrawlStarsMapDto } from "../../../core/dto/Brawlstars/Map.dto";

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
    console.log(timestamp)
    const momentObj = moment.utc(timestamp, "YYYYMMDDHHmmss");
    return momentObj.tz("Europe/Berlin").toDate();
}

export default new Command({
    name: "rotation",
    description: "Check Brawl Stars Rotation of Maps",
    run: async ({ interaction }) => {
        const brawlStarsMaps = await BrawlStarsService.getInstance().getRotation();

        if (brawlStarsMaps.length < 1) {
            return interaction.followUp({ embeds: [ErrorMessages.getDefaultErrorEmbeddedMessage()] });
        }

        const onGoingMaps = brawlStarsMaps.filter((m) => {
            return convertTimestamp(m.startTime).getTime() <= Date.now()
        });
        const upComingMaps = brawlStarsMaps.filter((m) => convertTimestamp(m.startTime).getTime() > Date.now());

        const onGoingEmbed = createEmbed('Ongoing Rotation of Maps', onGoingMaps, true);
        const upComingEmbed = createEmbed('Upcoming Rotation of Maps', upComingMaps, false);

        interaction.followUp({ embeds: [onGoingEmbed, upComingEmbed] });
    }
});
