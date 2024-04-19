import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios, { Axios } from 'axios';
import { Guild, PartialGuild } from 'common/types/Guild';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  private readonly axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://discord.com/api',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    });
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
}
