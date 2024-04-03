import { Command } from "../../structures/Command";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service"
import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "../../static/Theme"
import { ErrorMessages } from "../../static/Error";
import { Converters } from "../../static/Converters";
import { client } from "../..";
import moment = require("moment");

function convertTimestamp(timestamp: string): Date {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hours = timestamp.slice(9, 11);
    const minutes = timestamp.slice(11, 13);
    const seconds = timestamp.slice(13, 15);

    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`);
}

export default new Command({
    name: "rotation",
    description: "Check Brawl Stars Rotion of Maps",
    run: async ({ interaction }) => {
        const brawlStarsMaps = await BrawlStarsService.getInstance().getRotation();

        if (brawlStarsMaps.length < 1) {
            return interaction.followUp({ embeds: [ ErrorMessages.getDefaultErrorEmbeddedMessage() ]});
        }

        const onGoingMaps = brawlStarsMaps.filter((m) => convertTimestamp(m.startTime).getTime() <= Date.now());
        const upComingMaps = brawlStarsMaps.filter((m) => convertTimestamp(m.startTime).getTime() > Date.now());

        const onGoingEmbed = new EmbedBuilder()
        .setColor(ColorCodes.primaryColor)
        .setTitle('Ongoing Rotion of Maps')
        .setTimestamp();

        onGoingMaps.map((map) => {
            let name = Converters.capitalize(map.event.map);
            const emoji = client.emojis.cache.find(emoji => emoji.name === map.event.mode.toUpperCase())
            
            if (emoji) name = `${emoji} ${name}`;

            const endDate = convertTimestamp(map.endTime);
            
            onGoingEmbed.addFields({
                name: name, 
                value: `Until ${(moment(endDate)).format('DD MMM HH:mm')}`, 
                inline: true,
            });
        });

        const upComingEmbed = new EmbedBuilder()
        .setColor(ColorCodes.primaryColor)
        .setTitle('Upcoming Rotion of Maps')
        .setTimestamp();

        upComingMaps.map((map) => {
            let name = Converters.capitalize(map.event.map);
            const emoji = client.emojis.cache.find(emoji => emoji.name === map.event.mode.toUpperCase())
            
            if (emoji) name = `${emoji} ${name}`;

            const startDate = convertTimestamp(map.startTime);
            
            upComingEmbed.addFields({
                name: name, 
                value: `Arrives on ${(moment(startDate)).format('DD MMM HH:mm')}`, 
                inline: true,
            });
        });

        interaction.followUp({ embeds: [onGoingEmbed, upComingEmbed] });
    }
});