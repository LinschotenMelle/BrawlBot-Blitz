import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm/entities/User';
import { AuthenticatedGuard } from '../../auth/utils/Guards';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';

@Controller(Routes.DISCORD)
@ApiTags('Discord')
@ApiOAuth2([])
export class DiscordController {
  constructor(
    @Inject(Services.DISCORD_SERVICE)
    private readonly discordService: IDiscordService,
  ) {}

  @Get('/guilds')
  @UseGuards(AuthenticatedGuard)
  async getGuilds(@AuthUser() user: User) {
    return this.discordService.getActiveGuilds(user);
  }

  @Get('/guilds/:guildId')
  @UseGuards(AuthenticatedGuard)
  getGuildDetails(@Param('guildId') guildId: string) {
    return this.discordService.getGuildDetails(guildId);
  }

  @Get('/guilds/:guildId/channels')
  @UseGuards(AuthenticatedGuard)
  getGuildChannels(@Param('guildId') guildId: string) {
    return this.discordService.getGuildChannels(guildId);
  }
}
