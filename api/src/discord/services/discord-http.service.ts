import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios, { Axios } from 'axios';
import { Guild } from 'common/types/Guild';
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor/dev';
import { GuildChannel } from 'common/types/GuildChannel';
import { PartialGuild } from '../mapper/discord';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  private readonly axios: AxiosCacheInstance;

  constructor() {
    const instance = axios.create({
      baseURL: 'https://discord.com/api',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    });

    this.axios = setupCache(instance);
  }

  fetchBotGuilds() {
    return this.axios.get<PartialGuild[]>('/users/@me/guilds');
  }

  fetchUserGuilds(accessToken: string) {
    return this.axios.get<PartialGuild[]>('/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  fetchGuildDetails(guildId: string) {
    return this.axios.get<Guild>(`/guilds/${guildId}`);
  }

  fetchGuildChannels(guildId: string) {
    return this.axios.get<GuildChannel[]>(`/guilds/${guildId}/channels`);
  }
}
