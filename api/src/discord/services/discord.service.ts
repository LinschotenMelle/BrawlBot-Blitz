import { Inject, Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import { Services } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { User } from '../../utils/typeorm/entities/User';
import { PartialGuild } from '../mapper/discord';

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
    console.log(response.data);
    return response.data;
  }
}
