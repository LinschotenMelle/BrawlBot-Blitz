import { ColorResolvable } from "discord.js";

export class ColorCodes {
    // Prevent instantiation
    private constructor() {
        throw new Error("ColorCodes cannot be instantiated.");
    }

    // Static properties for color codes
    static primaryColor: ColorResolvable = 0xF6CA25;
    static secondaryColor: ColorResolvable  = 0x90158E;
    static darkBlueColor: ColorResolvable  = 0x101826;
    static errorRedColor: ColorResolvable  = 0xf65d3f;

    // Static method to get all color codes
    static getAllColors(): { [key: string]: ColorResolvable } {
        return {
            primaryColor: ColorCodes.primaryColor,
            secondaryColor: ColorCodes.secondaryColor,
            darkBlueColor: ColorCodes.darkBlueColor,
            errorRedColor: ColorCodes.errorRedColor,
        };
    }
}