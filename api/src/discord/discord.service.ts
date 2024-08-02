import { Inject, Injectable } from '@nestjs/common';
import { Services } from '../utils/constants';
import { User } from '../utils/typeorm/entities/User';
import { PartialGuild } from '../utils/types/discord';
import { GuildMemberCount } from '../utils/entities/GuildMemberCount';
import { GuildChannel } from '../utils/types/GuildChannel';
import { WelcomeMessage } from '../utils/entities/WelcomeMessage';
import { IDiscordHttpService } from './discord-http.service';

export interface IDiscordService {
  getActiveGuilds(user: User): Promise<PartialGuild[]>;
  getGuildDetails(guildId: string): Promise<PartialGuild>;
  getGuildChannels(guildId: string): Promise<GuildChannel[]>;
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
  async getActiveGuilds(user: User): Promise<PartialGuild[]> {
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
