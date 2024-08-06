import { Collection, ColorResolvable, GuildEmoji } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export class Emojis {
  private static instance: Emojis;
  private readonly list: Collection<string, GuildEmoji>;

  constructor(client: ExtendedClient) {
    this.list = client.emojis.cache;
  }

  public static getInstance(client: ExtendedClient): Emojis {
    if (!Emojis.instance) {
      Emojis.instance = new Emojis(client);
    }
    return Emojis.instance;
  }

  get trophy() {
    return this.list.find((e) => e.id === "1226627497769173005");
  }

  get clubs() {
    return this.list.find((e) => e.id === "1226633730215645274");
  }

  get soloVictories() {
    return this.list.find((e) => e.id === "1225177473285754940");
  }

  get duoVictories() {
    return this.list.find((e) => e.id === "1225177530567495711");
  }

  get threeVsThreeVictories() {
    return this.list.find((e) => e.id === "1226636027628879882");
  }

  get brawlers() {
    return this.list.find((e) => e.id === "1227367109936418819");
  }

  get info() {
    return this.list.find((e) => e.id === "1227367122880172132");
  }

  get barBlueOne() {
    return this.list.find((e) => e.id === "1270358282648948776");
  }

  get barBlueTwo() {
    return this.list.find((e) => e.id === "1270365630381691014");
  }

  get barBlueThree() {
    return this.list.find((e) => e.id === "1270365773012926485");
  }

  get barRedOne() {
    return this.list.find((e) => e.id === "1270365580268146710");
  }

  get barRedTwo() {
    return this.list.find((e) => e.id === "1270365629257486397");
  }

  get barRedThree() {
    return this.list.find((e) => e.id === "1270365771662495826");
  }
}
