import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios from 'axios';
import { PartialGuild } from '../../utils/types';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  fetchBotGuilds() {
    return axios.get<PartialGuild[]>(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      },
    );
  }
  fetchUserGuilds(accessToken: string) {
    return axios.get<PartialGuild[]>(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }
}
