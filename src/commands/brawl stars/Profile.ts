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

import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
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
    private initName!: string;
    private initTag!: string;
    private initStyle!: ButtonStyle;
    private isEnabled!  : boolean;

    constructor(name: string, tag: string, style: ButtonStyle = ButtonStyle.Primary, initialDisabled: boolean = true) {
        this.initName = name;
        this.initTag = tag;
        this.initStyle = style;
        this.isEnabled = initialDisabled;
    }

    enabled(isEnabled: boolean = true): void {
        this.isEnabled = isEnabled;    
    }

    private get _customId(): string {
        return `${this.initTag}_${this.initName}`;
    }

    public get button(): ButtonBuilder {
        return new ButtonBuilder()
        .setCustomId(this._customId)
        .setLabel(this.initName)
        .setStyle(this.initStyle ?? ButtonStyle.Primary)
        .setDisabled(!this.isEnabled);
    }

    public get customId(): string {
        return this._customId;
    }
}

function paginatedBrawlersEmbed(profile: BrawlStarsPlayer, page: number, pageSize: number, totalPages: number): EmbedBuilder {
    const brawlersEmbed = new EmbedBuilder()
        .setColor(ColorCodes.primaryColor)
        .setTitle(`${profile.name} - ${profile.tag}`)
        .setThumbnail(Constants.logo.name)
        .setFooter({ text: 'Page: ' + (page + 1) + '/' + totalPages })
        .setTimestamp();

    profile.brawlers.sort((a, b) => b.trophies - a.trophies).slice(page * pageSize, page * pageSize + pageSize).forEach(brawler => {
        brawlersEmbed.addFields({ name: brawler.name, value: `Trophies: ${brawler.trophies}` });
    });

    return brawlersEmbed;

}

export default new Command({
    name: "profile",
    options: [{
        name: "tag",
        description: "A Brawl Stars Tag",
        type: ApplicationCommandOptionType.String,
    }],
    description: "Check Brawl Stars Rotation of Maps",
    run: async ({ interaction }) => {
        const emojis = Emojis.getInstance(client);
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
        .setFields(
            { name: `${emojis.trophy} Trophies`, value: `${profile.trophies}/${profile.highestTrophies}` },
            { name: `${emojis.clubs} Club`, value: `${profile.club ? `[${profile.club!.name}](https://brawlify.com/stats/club/${profile.club!.tag.replaceAll('#', '')})` : 'Not in a club'}` },
            { name: `${emojis.soloVictories} Solo Victories`, value: `${profile.soloVictories}`, inline: true },
            { name: `${emojis.duoVictories} Duo Victories`, value: `${profile.duoVictories}`, inline: true },
            { name: `${emojis.threeVsThreeVictories} 3v3 Victories`, value: `${profile["3vs3Victories"]}`, inline: true },
            { name: 'Experience Level', value: `${profile.expLevel}` },
        )
        .setFooter({ text: 'Brawl Stars Profile' })
        .setThumbnail(Constants.logo.name)
        .setTimestamp();
        
        
        /** Buttons */
        const brawlersButton = new BBEmbedButton('Brawlers', `${tag}`);
        const backButton = new BBEmbedButton('Back', `${tag}`, ButtonStyle.Danger );
        const moreButton = new BBEmbedButton('>', `${tag}`, ButtonStyle.Secondary );
        const lessButton = new BBEmbedButton('<', `${tag}`, ButtonStyle.Primary, false);
        
        
        /** Components */
        const profileComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(brawlersButton.button);
        
        
        interaction.followUp({ embeds: [embed], components: interaction.channel ? [profileComponent] : [], files: [Constants.logo.attachment] });
        
        if (interaction.channel) {
            const collector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button
            });
            
            let page = 0;
            const pageSize = 25;
            const totalPages = Math.ceil(profile.brawlers.length / pageSize);
            collector.on('collect', async (i) => {
                if (i.customId === brawlersButton.customId) {
                    await i.update({ embeds: [paginatedBrawlersEmbed(profile, page, pageSize, totalPages)], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(backButton.button, lessButton.button, moreButton.button)] });
                }
                if (i.customId === moreButton.customId) {
                    page++;
                    lessButton.enabled(page != 0);
                    moreButton.enabled(page != totalPages -1);
                    await i.update({ embeds: [paginatedBrawlersEmbed(profile, page, pageSize, totalPages)], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(backButton.button, lessButton.button, moreButton.button)] });
                }
                if (i.customId === lessButton.customId) {
                    page--;
                    lessButton.enabled(page != 0);
                    moreButton.enabled(page != totalPages -1);
                    await i.update({ embeds: [paginatedBrawlersEmbed(profile, page, pageSize,totalPages)], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(backButton.button, lessButton.button, moreButton.button)] });
                }
                if (i.customId === backButton.customId) {
                    await i.update({ embeds: [embed], components: [profileComponent] });
                }
            });
        }
    }
});