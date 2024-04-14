import axios, { AxiosInstance } from "axios";
import { BrawlStarsMapDto } from "../dto/brawlstars/Map.dto";
import { BrawlStarsPlayer } from "../dto/brawlstars/Player.dto";
import { Brawler, BrawlerResponse } from "../dto/brawlstars/Brawler.dto";
import { EmbedBuilder } from "discord.js";
import { ColorCodes } from "../../src/static/Theme";
import { Constants } from "../../src/static/Contants";
import { client } from "../../src";
import { Converters } from "../../src/static/Converters";

export class BrawlStarsService {
  private static _instance = new BrawlStarsService();

  private axios: AxiosInstance;

  constructor() {
    if (BrawlStarsService._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    BrawlStarsService._instance = this;

    this.axios = axios.create({
      baseURL: process.env.BRAWL_STARS_API_URL,
      headers: { Authorization: `Bearer ${process.env.BRAWL_STARS_API_TOKEN}` },
    });
  }

  public static get instance(): BrawlStarsService {
    if (!BrawlStarsService._instance) {
      BrawlStarsService._instance = new BrawlStarsService();
    }
    return BrawlStarsService._instance;
  }

  async initialize(): Promise<void> {
    const response = await this.axios.post(
      "https://developer.brawlstars.com/api/login",
      {
        email: process.env.BRAWL_STARS_API_EMAIL,
        password: process.env.BRAWL_STARS_API_PASSWORD,
      }
    );

    this.axios = axios.create({
      baseURL: process.env.BRAWL_STARS_API_URL,
      headers: { Authorization: `Bearer ${response.data.temporaryAPIToken}` },
    });
  }

  async getRotation(): Promise<BrawlStarsMapDto[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlStarsMapDto[]>(
          "/events/rotation"
        );
        return response?.data ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }

  async getBrawlers(): Promise<Brawler[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlerResponse>("/brawlers");
        return response?.data.items ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }

  async getProfileByTag(tag: string): Promise<BrawlStarsPlayer | undefined> {
    let retries = 0;
    while (retries < 2) {
      try {
        const response = await this.axios.get(`/players/${tag}`);
        return response.data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          await this.initialize();
          retries++;
        } else {
          return undefined;
        }
      }
    }

    return undefined;
  }

  calculateRank(trophies: number): number {
    // Define the trophy requirements for each rank
    const trophyRequirements = [
      0, 10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 220, 260, 300, 340,
      380, 420, 460, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
      1050, 1100, 1150, 1200, 1250,
    ];

    const v = trophyRequirements.findIndex((t) => trophies < t);

    if (v == -1) {
      return 35;
    }

    return v;
  }

  paginatedBrawlersEmbed(
    profile: BrawlStarsPlayer,
    page: number,
    pageSize: number,
    totalPages: number
  ): EmbedBuilder {
    const brawlersEmbed = new EmbedBuilder()
      .setColor(ColorCodes.primaryColor)
      .setTitle(`${profile.name} - ${profile.tag}`)
      .setThumbnail(Constants.logo.name)
      .setFooter({ text: "Page: " + (page + 1) + "/" + totalPages })
      .setTimestamp();

    const paginatedBralwers = profile.brawlers
      .sort((a, b) => b.trophies - a.trophies)
      .slice(page * pageSize, page * pageSize + pageSize);

    paginatedBralwers.forEach((brawler) => {
      const brawlerEmoji = client.emojis.cache.find(
        (e) => e.name === brawler.name.replace(/[ &-.]/g, "")
      );
      const convertedName = Converters.capitalizeFirstLetter(brawler.name);
      const name = brawlerEmoji
        ? `${brawlerEmoji} ${convertedName}`
        : convertedName;

      const rankEmoji = client.emojis.cache.find(
        (e) => e.name === `Rank_${this.calculateRank(brawler.highestTrophies)}`
      );

      const convertedValue = `${brawler.trophies}/${brawler.highestTrophies}`;
      const value = rankEmoji
        ? `${rankEmoji} ${convertedValue}`
        : convertedValue;

      brawlersEmbed.addFields({
        name: `${name} (L. ${brawler.power})`,
        value: value,
        inline: true,
      });
    });

    return brawlersEmbed;
  }
}
