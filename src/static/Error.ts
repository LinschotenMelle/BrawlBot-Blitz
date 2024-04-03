import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "./Theme";

export class ErrorMessages {
    private constructor() {
        throw new Error("ErrorMessages cannot be instantiated.");
    }

    static getDefaultErrorEmbeddedMessage(): EmbedBuilder {
        return new EmbedBuilder()
        .setColor(ColorCodes.errorRedColor)
        .setTitle('Error')
        .setDescription('Something went wrong! Try again later...')
        .setTimestamp();
    }
}