import { Brawler } from "./Brawler.dto";

export class Icon {
    id!: number;
}
   
export class Club {
    tag!: string;
    name!: string;
}

export class BrawlStarsPlayer {
    tag!: string;
    name!: string;
    nameColor!: string;
    icon!: Icon;
    trophies!: number;
    highestTrophies!: number;
    highestPowerPlayPoints!: number;
    expLevel!: number;
    expPoints!: number;
    isQualifiedFromChampionshipChallenge!: boolean;
    "3vs3Victories"!: number;
    soloVictories!: number;
    duoVictories!: number;
    bestRoboRumbleTime!: number;
    bestTimeAsBigBrawler!: number;
    club?: Club;
    brawlers!: Brawler[];
}
   