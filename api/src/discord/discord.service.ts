import { Inject, Injectable } from '@nestjs/common';
import { Services } from '../utils/constants';
import { GuildMemberCount } from './entities/GuildMemberCount';
import { GuildChannelDto } from './dto/GuildChannel.dto';
import { WelcomeMessage } from './entities/WelcomeMessage';
import { IDiscordHttpService } from './discord-http.service';
import { User } from '../user/entities/User';
import { PartialGuildDto } from './dto/Guild.dto';

export interface IDiscordService {
  getActiveGuilds(user: User): Promise<PartialGuildDto[]>;
  getGuildDetails(guildId: string): Promise<PartialGuildDto>;
  getGuildChannels(guildId: string): Promise<GuildChannelDto[]>;
  getWelcomeMessage(guildId: string): Promise<WelcomeMessage>;
  postMemberCount(guildId: string, channelId: string): Promise<void>;
  getMemberCount(guildId: string): Promise<GuildMemberCount>;
}

@Injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @Inject(Services.DISCORD_HTTP_SERVICE)
    private readonly discordHttpService: IDiscordHttpService,
  ) {}
  async getActiveGuilds(user: User): Promise<PartialGuildDto[]> {
    const { data: userGuilds } = await this.discordHttpService.fetchUserGuilds(
      user.accessToken,
    );
    const { data: botGuilds } = await this.discordHttpService.fetchBotGuilds();
    const adminUserGuilds = userGuilds.filter((g) => {
      // Check administratior permission
      return (g.permissions & 0x8) === 8;
    });

    adminUserGuilds.forEach((g) => {
      g.isActive = botGuilds.find((bg) => bg.id === g.id) !== undefined;
    });

    return adminUserGuilds.sort((a, b) => {
      return Number(b.isActive) - Number(a.isActive);
    });
  }

  async getGuildDetails(guildId: string) {
    const response = await this.discordHttpService.fetchGuildDetails(guildId);
    return response.data;
  }

  async getGuildChannels(guildId: string) {
    const response = await this.discordHttpService.fetchGuildChannels(guildId);
    return response.data;
  }

  async getWelcomeMessage(guildId: string) {
    return this.discordHttpService.getWelcomeMessage(guildId);
  }

  async postMemberCount(guildId: string, channelId: string) {
    return this.discordHttpService.postMemberCount(guildId, channelId);
  }

  async getMemberCount(guildId: string) {
    return this.discordHttpService.getMemberCount(guildId);
  }
}
