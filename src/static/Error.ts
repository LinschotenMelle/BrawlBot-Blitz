import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "./Theme";

export class ErrorMessages {
    private constructor() {
        throw new Error("ErrorMessages cannot be instantiated.");
    }

    static getDefaultErrorEmbeddedMessage(str: string | undefined = undefined): EmbedBuilder {
        return new EmbedBuilder()
        .setColor(ColorCodes.errorRedColor)
        .setTitle('Error')
        .setDescription(str ?? 'Something went wrong! Try again later...')
        .setTimestamp();
    }

    static getDefaultInvalidTypeEmbeddedMessage(): EmbedBuilder {
        return new EmbedBuilder()
        .setColor(ColorCodes.errorRedColor)
        .setTitle('Error')
        .setDescription('Invalid tag. Make sure your tag is like the following "#QY8VU02R"')
        .setTimestamp();
    }
}