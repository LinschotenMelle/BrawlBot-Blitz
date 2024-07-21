import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios from 'axios';
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';
import { PartialGuild } from '../mapper/discord';
import { Guild } from '../../utils/types/Guild';
import { GuildChannel } from '../../utils/types/GuildChannel';
import { WelcomeMessage } from '../../utils/entities/WelcomeMessage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuildMemberCount } from '../../utils/entities/GuildMemberCount';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  private readonly userAxios: AxiosCacheInstance;
  private readonly botAxios: AxiosCacheInstance;

  constructor(
    @InjectRepository(WelcomeMessage)
    private readonly welcomeRepository: Repository<WelcomeMessage>,
    @InjectRepository(GuildMemberCount)
    private readonly guildMemberCountRepository: Repository<GuildMemberCount>,
  ) {
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

  getWelcomeMessage(guildId: string): Promise<WelcomeMessage> {
    return this.welcomeRepository.findOneBy({
      guildId: guildId,
    });
  }

  async postMemberCount(guildId: string, channelId: string): Promise<void> {
    const channel = this.guildMemberCountRepository.create({
      guildId: guildId,
      channelId: channelId,
    });

    await this.guildMemberCountRepository.save(channel);
  }

  async getMemberCount(guildId: string): Promise<GuildMemberCount> {
    return this.guildMemberCountRepository.findOneBy({
      guildId: guildId,
    });
  }
}
