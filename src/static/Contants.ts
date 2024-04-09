import { AttachmentBuilder } from "discord.js";
import { BrawlerRarity } from "../../core/enums/BrawlerRarity";

export class BBAttachment {
    private initName!: string;

    constructor(name: string) {
        this.initName = name
    } 

    public get attachment(): AttachmentBuilder {
        return new AttachmentBuilder(`./src/assets/${this.initName}`);
    }

    public get name(): string {
        return `attachment://${this.initName}`;
    }
}

export class Constants {
    private constructor() {
        throw new Error("Constants cannot be initialized");
    }

    static ab_logo = new AttachmentBuilder('./src/assets/logo.png');

    static timerGif: string = "https://cdn.discordapp.com/attachments/636267043452223498/711689977200771112/517785620060438548.gif?ex=661c48f1&is=6609d3f1&hm=fd15fd13b45942c7a054e3200fef564d4902a32436bd99faddcd2cd7e79acbee&"
    static logo: BBAttachment = new BBAttachment('logo.png');

    static rarity(name: string): number {
        return this.rarityMap.get(name) || BrawlerRarity.Common;
    }
    
    static rarityMap: Map<string, BrawlerRarity> = new Map([
        /** COMMON */
        ['SHELLY', BrawlerRarity.Common],
        /** RARE */
        ['NITA', BrawlerRarity.Rare],
        ['COLT', BrawlerRarity.Rare],
        ['BULL', BrawlerRarity.Rare],
        ['BROCK', BrawlerRarity.Rare],
        ['PRIMO', BrawlerRarity.Rare],
        ['BARLEY', BrawlerRarity.Rare],
        ['POCO', BrawlerRarity.Rare],
        ['ROSA', BrawlerRarity.Rare],
        /** SUPER RARE */
        ['JESSIE', BrawlerRarity.SuperRare],
        ['DYNAMIKE', BrawlerRarity.SuperRare],
        ['TICK', BrawlerRarity.SuperRare],
        ['8-BIT', BrawlerRarity.SuperRare],
        ['RICO', BrawlerRarity.SuperRare],
        ['DARRYL', BrawlerRarity.SuperRare],
        ['PENNY', BrawlerRarity.SuperRare],
        ['CARL', BrawlerRarity.SuperRare],
        ['JACKY', BrawlerRarity.SuperRare],
        ['GUS', BrawlerRarity.SuperRare],
        /** EPIC */
        ['BO', BrawlerRarity.Epic],
        ['EMZ', BrawlerRarity.Epic],
        ['STU', BrawlerRarity.Epic],
        ['PIPER', BrawlerRarity.Epic],
        ['PAM', BrawlerRarity.Epic],
        ['FRANK', BrawlerRarity.Epic],
        ['BIBI', BrawlerRarity.Epic],
        ['BEA', BrawlerRarity.Epic],
        ['NANI', BrawlerRarity.Epic],
        ['EDGAR', BrawlerRarity.Epic],
        ['GRIFF', BrawlerRarity.Epic],
        ['GROM', BrawlerRarity.Epic],
        ['BONNIE', BrawlerRarity.Epic],
        ['GALE', BrawlerRarity.Epic],
        ['COLETTE', BrawlerRarity.Epic],
        ['BELLE', BrawlerRarity.Epic],
        ['ASH', BrawlerRarity.Epic],
        ['LOLA', BrawlerRarity.Epic],
        ['SAM', BrawlerRarity.Epic],
        ['MANDY', BrawlerRarity.Epic],
        ['MAISIE', BrawlerRarity.Epic],
        ['HANK', BrawlerRarity.Epic],
        ['PEARL', BrawlerRarity.Epic],
        ['LARRY & LAWRIE', BrawlerRarity.Epic],
        ['ANGELO', BrawlerRarity.Epic],
        /** MYHIC */
        ['MORTIS', BrawlerRarity.Mythic],
        ['TARA', BrawlerRarity.Mythic],
        ['GENE', BrawlerRarity.Mythic],
        ['MAX', BrawlerRarity.Mythic],
        ['MR. P', BrawlerRarity.Mythic],
        ['SPROUT', BrawlerRarity.Mythic],
        ['BYRON', BrawlerRarity.Mythic],
        ['SQUEAK', BrawlerRarity.Mythic],
        ['LOU', BrawlerRarity.Mythic],
        ['RUFFS', BrawlerRarity.Mythic],
        ['BUZZ', BrawlerRarity.Mythic],
        ['FANG', BrawlerRarity.Mythic],
        ['EVE', BrawlerRarity.Mythic],
        ['JANET', BrawlerRarity.Mythic],
        ['OTIS', BrawlerRarity.Mythic],
        ['BUSTER', BrawlerRarity.Mythic],
        ['GRAY', BrawlerRarity.Mythic],
        ['R-T', BrawlerRarity.Mythic],
        ['WILLOW', BrawlerRarity.Mythic],
        ['DOUG', BrawlerRarity.Mythic],
        ['CHUCK', BrawlerRarity.Mythic],
        ['CHARLIE', BrawlerRarity.Mythic],
        ['MICO', BrawlerRarity.Mythic],
        ['MELODIE', BrawlerRarity.Mythic],
        /** LEGENDARY */
        ['SPIKE', BrawlerRarity.Legendary],
        ['CROW', BrawlerRarity.Legendary],
        ['LEON', BrawlerRarity.Legendary],
        ['SANDY', BrawlerRarity.Legendary],
        ['AMBER', BrawlerRarity.Legendary],
        ['MEG', BrawlerRarity.Legendary],
        ['SURGE', BrawlerRarity.Legendary],
        ['CHESTER', BrawlerRarity.Legendary],
        ['CORDELIUS', BrawlerRarity.Legendary],
        ['KIT', BrawlerRarity.Legendary],
    ]);
}