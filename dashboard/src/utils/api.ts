import axios, { Axios } from "axios";
import {
  GuildChannelDto,
  GuildDto,
  PartialGuildDto,
  UserDto,
  YoutubeChannelDto,
} from "../client";

export class Api {
  private static _instance = new Api();
  private readonly axios: Axios;

  constructor() {
    if (Api._instance) {
      throw new Error(
        "Error: Instantiation failed: Use Api.getInstance() instead of new."
      );
    }
    Api._instance = this;

    this.axios = axios.create({
      baseURL: "http://localhost:3001/api",
      withCredentials: true,
    });
  }

  public static get instance(): Api {
    if (!Api._instance) {
      Api._instance = new Api();
    }
    return Api._instance;
  }

  getAuthStatus = () => this.axios.get<UserDto>("/auth/me");

  postLogout = () => this.axios.post("/auth/logout");

  getGuilds = () => this.axios.get<PartialGuildDto[]>("/discord/guilds");

  getGuildDetails = (guildId: string) =>
    this.axios.get<GuildDto>(`/discord/guilds/${guildId}`);

  getGuildChannels = (guildId: string) =>
    this.axios.get<GuildChannelDto[]>(`/discord/guilds/${guildId}/channels`);

  getYoutubeData = (guildId: string) =>
    this.axios.get<YoutubeChannelDto>(`/youtube/${guildId}`);

  putYoutubeData = (guildId: string, data: Map<string, string>) =>
    this.axios.put(`/youtube/${guildId}`, data);
}
