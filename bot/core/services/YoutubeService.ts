import axios, { AxiosInstance } from "axios";
import { client } from "../../src";
import { EmbedBuilder, NewsChannel, TextChannel } from "discord.js";
import { YoutubeChannel } from "../../core/dto/youtube/YoutubeChannel.dto";

export class YoutubeService {
  private readonly apiAxios: AxiosInstance;
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
    });

    this.apiAxios = axios.create({
      baseURL: "http://localhost:3001/api/youtube",
      headers: {
        token: process.env.TOKEN,
      },
    });
  }

  static initialize(): void {
    const serviceInstance = new YoutubeService();
    setInterval(async () => {
      await serviceInstance.search();
    }, 15 * 60 * 1000);
  }

  private async search(): Promise<void> {
    let activeChannels: YoutubeChannel[] = [];

    try {
      const response = await this.apiAxios.get<YoutubeChannel[]>("/channels");
      activeChannels = response.data;
    } catch (e) {
      return;
    }

    for (const channel of activeChannels) {
      const response = await this.axios.get("/search", {
        params: {
          key: channel.apiKey,
          channelId: channel.channelId,
          part: "snippet",
          order: "date",
          type: "video",
          maxResults: 1,
        },
      });

      const guild = client.guilds.cache.find(
        (guild) => guild.id === channel.guildId
      );

      const selectedchannel = guild?.channels.cache.find(
        (c) => c.id === channel.guildChannelId
      ) as TextChannel | NewsChannel;

      if (!selectedchannel) {
        return;
      }

      const latestVideo = response.data.items[0];

      const latestVideoDate = new Date(latestVideo.snippet.publishedAt);
      const channelDate = new Date(channel.latestVideoDateTime ?? "");

      if (!latestVideo || latestVideoDate.getTime() === channelDate.getTime())
        return;

      const embed = new EmbedBuilder()
        .setTitle(latestVideo.snippet.title)
        .setAuthor({
          name: latestVideo.snippet.channelTitle,
          url: `https://www.youtube.com/channel/${latestVideo.snippet.channelId}`,
        })
        .setDescription(latestVideo.snippet.description)
        .setImage(latestVideo.snippet.thumbnails.high.url)
        .setURL(`https://www.youtube.com/watch?v=${latestVideo.id.videoId}`);

      const role = guild?.roles.cache.find((r) => r.id === channel.roleId);

      selectedchannel.send({
        content: `${role}` ?? "@everyone",
        embeds: [embed],
      });

      try {
        await this.apiAxios.put(`/channels/${channel.guildId}`, {
          latestVideoDateTime: latestVideo.snippet.publishedAt,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
