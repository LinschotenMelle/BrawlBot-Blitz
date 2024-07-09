import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios from 'axios';
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';
import { PartialGuild } from '../mapper/discord';
import { Guild } from '../../utils/types/Guild';
import { GuildChannel } from '../../utils/types/GuildChannel';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  private readonly userAxios: AxiosCacheInstance;
  private readonly botAxios: AxiosCacheInstance;

  constructor() {
    this.userAxios = setupCache(
      axios.create({
        baseURL: 'https://discord.com/api',
      }),
    );
    this.botAxios = setupCache(
      axios.create({
        baseURL: 'https://discord.com/api',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }),
    );
  }

  fetchBotGuilds() {
    return this.botAxios.get<PartialGuild[]>('/users/@me/guilds');
  }

  fetchUserGuilds(accessToken: string) {
    return this.userAxios.get<PartialGuild[]>('/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  fetchGuildDetails(guildId: string) {
    return this.botAxios.get<Guild>(`/guilds/${guildId}`);
  }

  fetchGuildChannels(guildId: string) {
    return this.botAxios.get<GuildChannel[]>(`/guilds/${guildId}/channels`);
  }
}
