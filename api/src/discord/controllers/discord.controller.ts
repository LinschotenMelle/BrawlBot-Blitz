import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm/entities/User';
import { AuthenticatedGuard } from '../../auth/utils/Guards';

@Controller(Routes.DISCORD)
export class DiscordController {
  constructor(
    @Inject(Services.DISCORD_SERVICE)
    private readonly discordService: IDiscordService,
  ) {}

  @Get('/guilds')
  @UseGuards(AuthenticatedGuard)
  getGuilds(@AuthUser() user: User) {
    return this.discordService.getActiveGuilds(user);
  }
}
