import axios, { Axios } from "axios";
import { User } from "common/types/User";
import { Guild, PartialGuild } from "common/types/Guild";
import { GuildChannel } from "common/types/GuildChannel";
import { YoutubeChannel } from "common/types/YoutubeChannel";

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

  getAuthStatus = () => this.axios.get<User>("/auth/me");

  postLogout = () => this.axios.post("/auth/logout");

  getGuilds = () => this.axios.get<PartialGuild[]>("/discord/guilds");

  getGuildDetails = (guildId: string) =>
    this.axios.get<Guild>(`/discord/guilds/${guildId}`);

  getGuildChannels = (guildId: string) =>
    this.axios.get<GuildChannel[]>(`/discord/guilds/${guildId}/channels`);

  getYoutubeData = (guildId: string) =>
    this.axios.get<YoutubeChannel>(`/youtube/${guildId}`);

  putYoutubeData = (guildId: string, data: Map<string, string>) =>
    this.axios.put(`/youtube/${guildId}`, data);
}
