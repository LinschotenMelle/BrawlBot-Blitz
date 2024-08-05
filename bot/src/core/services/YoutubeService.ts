import axios, { AxiosInstance } from "axios";
import { discordClient } from "../..";
import { EmbedBuilder, NewsChannel, TextChannel } from "discord.js";
import { YoutubeChannel } from "../dto/youtube/YoutubeChannel.dto";
import {
  youtubeControllerGetChannels,
  youtubeControllerUpdateChannel,
} from "../../client";

export class YoutubeService {
  private static instance?: YoutubeService;
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
    });
  }

  static async initialize(): Promise<void> {
    if (this.instance) throw Error("YoutubeService already initialized");

    const serviceInstance = new YoutubeService();
    this.instance = serviceInstance;
    setInterval(async () => {
      await serviceInstance.search();
    }, 15 * 60 * 1000);
  }

  private async search(): Promise<void> {
    let activeChannels: YoutubeChannel[] = [];

    try {
      const response = await youtubeControllerGetChannels();
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

      const guild = discordClient.guilds.cache.find(
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
        .setImage(latestVideo.snippet.thumbnails.high.url)
        .setURL(`https://www.youtube.com/watch?v=${latestVideo.id.videoId}`);

      if (latestVideo.snippet.description) {
        embed.setDescription(latestVideo.snippet.description);
      }

      const role =
        guild!.roles.cache.find((r) => r.id === channel.roleId) ??
        guild!.roles.everyone;

      selectedchannel.send({
        content: `${role} ${latestVideo.snippet.channelTitle} heeft zojuist "${latestVideo.snippet.title}" geüpload op YouTube! Bekijk het hier: https://www.youtube.com/watch?v=${latestVideo.id.videoId}`,
        embeds: [embed],
      });

      try {
        await youtubeControllerUpdateChannel({
          path: {
            guildId: channel.guildId,
          },
          body: {
            latestVideoDateTime: latestVideo.snippet.published,
          },
        });
      } catch (e) {
        // NOOP
      }
    }
  }
}
