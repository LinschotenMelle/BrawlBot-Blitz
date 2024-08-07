import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';
import { GuildDto, PartialGuildDto } from './dto/Guild.dto';
import { GuildChannelDto } from './dto/GuildChannel.dto';
import { WelcomeMessage } from './entities/WelcomeMessage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuildMemberCount } from './entities/GuildMemberCount';
import { ConfigService } from '@nestjs/config';

export interface IDiscordHttpService {
  fetchUserGuilds(
    accessToken: string,
  ): Promise<AxiosResponse<PartialGuildDto[]>>;
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuildDto[]>>;
  fetchGuildDetails(guildId: string): Promise<AxiosResponse<GuildDto>>;
  fetchGuildChannels(
    guildId: string,
  ): Promise<AxiosResponse<GuildChannelDto[]>>;
  getWelcomeMessage(guildId: string): Promise<WelcomeMessage>;
  postMemberCount(guildId: string, channelId: string): Promise<void>;
  getMemberCount(guildId: string): Promise<GuildMemberCount>;
}

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  private readonly userAxios: AxiosCacheInstance;
  private readonly botAxios: AxiosCacheInstance;

  constructor(
    @InjectRepository(WelcomeMessage)
    private readonly welcomeRepository: Repository<WelcomeMessage>,
    @InjectRepository(GuildMemberCount)
    private readonly guildMemberCountRepository: Repository<GuildMemberCount>,
    private readonly configService: ConfigService,
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
          Authorization: `Bot ${this.configService.getOrThrow('DISCORD_TOKEN')}`,
        },
      }),
    );
  }

  fetchBotGuilds() {
    return this.botAxios.get<PartialGuildDto[]>('/users/@me/guilds');
  }

  fetchUserGuilds(accessToken: string) {
    return this.userAxios.get<PartialGuildDto[]>('/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  fetchGuildDetails(guildId: string) {
    return this.botAxios.get<GuildDto>(`/guilds/${guildId}`);
  }

  fetchGuildChannels(guildId: string) {
    return this.botAxios.get<GuildChannelDto[]>(`/guilds/${guildId}/channels`);
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
