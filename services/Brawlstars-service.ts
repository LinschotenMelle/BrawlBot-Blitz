import axios, { AxiosInstance } from "axios";
import { BrawlStarsMapDto } from "../dto/Brawlstars/Map.dto";

export class BrawlStarsService {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
          baseURL: process.env.BRAWL_STARS_API_URL,
          headers: {"Authorization" : `Bearer ${process.env.BRAWL_STARS_API_TOKEN}`}
        });
      }


    async getRotation(): Promise<BrawlStarsMapDto[]> {
        try {
            const response = await this.axios.get<BrawlStarsMapDto[]>('/events/rotation');
            return response.data;
        } catch (e) {
            console.log(e)
            return []
        }
    }
}