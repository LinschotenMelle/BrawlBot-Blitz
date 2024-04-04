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

export class Constants {
    private constructor() {
        throw new Error("Constants cannot be initialized");
    }

    static timerGif: string = "https://cdn.discordapp.com/attachments/636267043452223498/711689977200771112/517785620060438548.gif?ex=661c48f1&is=6609d3f1&hm=fd15fd13b45942c7a054e3200fef564d4902a32436bd99faddcd2cd7e79acbee&"
}