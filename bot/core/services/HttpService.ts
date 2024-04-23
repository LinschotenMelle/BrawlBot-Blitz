import axios, { AxiosInstance } from "axios";

export class HttpService {
  private static _instance = new HttpService();

  private axios: AxiosInstance;

  constructor() {
    if (HttpService._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    HttpService._instance = this;

    this.axios = axios.create({
      baseURL: process.env.HTTP_API_URL,
    });
  }

  public static get instance(): HttpService {
    if (!HttpService._instance) {
      HttpService._instance = new HttpService();
    }
    return HttpService._instance;
  }

  async get<T>(url: string): Promise<T> {
    return (await this.axios.get<T>(url)).data;
  }
}
