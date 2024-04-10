import axios, { AxiosInstance } from "axios";
import { BrawlStarsMapDto } from "../dto/brawlstars/Map.dto";
import { BrawlStarsPlayer } from "../dto/brawlstars/Player.dto";

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
}
