import { Command } from "../../structures/Command";
import { BrawlStarsService } from "../../../services/Brawlstars-service"
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "rotation",
    description: "Check Brawl Stars Rotion of Maps",
    run: async ({ interaction }) => {
        const bsSerice = new BrawlStarsService();
        const data = await bsSerice.getRotation();

        // inside a command, event listener, etc.
    const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Brawl Stars Rotion of Maps')
    .setTimestamp()

    data.map((e) => {
        exampleEmbed.addFields({
            name: e.event.mode, value: e.event.map
        })
    })

        interaction.followUp({ embeds: [exampleEmbed] });
    }
});