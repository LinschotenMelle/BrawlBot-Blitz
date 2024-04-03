import { Command } from "../../structures/Command";
import { BrawlStarsService } from "../../../core/services/Brawlstars-service"
import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "../../static/Theme"
import { ErrorMessages } from "../../static/Error";

export default new Command({
    name: "rotation",
    description: "Check Brawl Stars Rotion of Maps",
    run: async ({ interaction }) => {
        const brawlStarsMaps = await BrawlStarsService.getInstance().getRotation();

        if (brawlStarsMaps.length < 1) {
            return interaction.followUp({ embeds: [ ErrorMessages.getDefaultErrorEmbeddedMessage() ]});
        }

        const embed = new EmbedBuilder()
        .setColor(ColorCodes.primaryColor)
        .setTitle('Brawl Stars Rotion of Maps')
        .setTimestamp();

        brawlStarsMaps.map((map) => {
            embed.addFields({
                name: map.event.mode, 
                value: map.event.map, 
                inline: true,
            });
        });

        interaction.followUp({ embeds: [embed] });
    }
});