import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BrawlStarsMapDto } from "../dto/Brawlstars/Map.dto";

export class BrawlStarsService {
    private static _instance = new BrawlStarsService();

    private axios: AxiosInstance;

    constructor() {
        if(BrawlStarsService._instance){
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        BrawlStarsService._instance = this;

        this.axios = axios.create({
          baseURL: process.env.BRAWL_STARS_API_URL,
          headers: {"Authorization" : `Bearer ${process.env.BRAWL_STARS_API_TOKEN}`}
        });
      }

    public static getInstance(): BrawlStarsService {
        return BrawlStarsService._instance;
    }

    async initialize(): Promise<void> {
        const response = await this.axios.post('https://developer.brawlstars.com/api/login', {
            "email": process.env.BRAWL_STARS_API_EMAIL,
            "password": process.env.BRAWL_STARS_API_PASSWORD,
        });

        this.axios = axios.create({
            baseURL: process.env.BRAWL_STARS_API_URL,
            headers: {"Authorization" : `Bearer ${response.data.temporaryAPIToken}`}
        });
    }

    async getRotation(): Promise<BrawlStarsMapDto[]> {
        let retries = 0;
        const maxRetries = 3;
    
        while (retries < maxRetries) {
            try {
                const response = await this.axios.get<BrawlStarsMapDto[]>('/events/rotation');
                return response?.data ?? [];
            } catch (e) {
                await this.initialize();
                retries++;
            }
        }
    
        return [];
    }
}