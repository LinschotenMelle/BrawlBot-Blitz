import axios, { AxiosInstance } from "axios";
import { discordClient } from "..";
import { EmbedBuilder, NewsChannel, TextChannel } from "discord.js";
import {
  YoutubeChannelDto,
  youtubeControllerGetChannels,
  youtubeControllerSearchLatestVideo,
  youtubeControllerUpdateChannel,
} from "../client";
import { ColorCodes } from "../static/Theme";

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
    let activeChannels: Array<YoutubeChannelDto>;

    try {
      const response = await youtubeControllerGetChannels();
      activeChannels = response.data;
    } catch (e) {
      return;
    }

    for (const channel of activeChannels) {
      const guild = discordClient.guilds.cache.find(
        (guild) => guild.id === channel.guildId
      );

      const selectedchannel = guild?.channels.cache.find(
        (c) => c.id === channel.guildChannelId
      ) as TextChannel | NewsChannel;

      if (!selectedchannel) {
        return;
      }

      const response = await youtubeControllerSearchLatestVideo({
        path: {
          guildId: channel.guildId,
        },
      });

      const latestVideo = response.data;

      const latestVideoDate = new Date(latestVideo.publishedAt);
      const channelDate = new Date(channel.latestVideoDateTime ?? "");

      if (!latestVideo || latestVideoDate.getTime() <= channelDate.getTime()) {
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(latestVideo.channelTitle)
        .setAuthor({
          name: latestVideo.channelTitle,
          url: `https://www.youtube.com/channel/${latestVideo.channelId}`,
        })
        .setImage(latestVideo.thumbnailUrl)
        .setColor(ColorCodes.primaryColor)
        .setURL(latestVideo.videoUrl);

      if (latestVideo.description) {
        embed.setDescription(latestVideo.description);
      }

      const role =
        guild!.roles.cache.find((r) => r.id === channel.roleId) ??
        guild!.roles.everyone;

      selectedchannel.send({
        content: `${role} ${latestVideo.channelTitle} heeft zojuist "${latestVideo.videoTitle}" geüpload op YouTube! Bekijk het hier: ${latestVideo.videoUrl}`,
        embeds: [embed],
      });

      try {
        await youtubeControllerUpdateChannel({
          path: {
            guildId: channel.guildId,
          },
          body: {
            latestVideoDateTime: latestVideo.publishedAt,
          },
        });
      } catch (e) {
        // NOOP
      }
    }
  }
}
