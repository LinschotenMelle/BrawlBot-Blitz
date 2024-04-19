import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm/entities/User';
import { AuthenticatedGuard } from '../../auth/utils/Guards';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { PartialGuildDto } from 'common/dtos/PartialGuild.dto';
import { PartialGuild } from '../mapper/discord';

@Controller(Routes.DISCORD)
@ApiTags('Discord')
@ApiOAuth2([])
export class DiscordController {
  constructor(
    @Inject(Services.DISCORD_SERVICE)
    private readonly discordService: IDiscordService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get('/guilds')
  @UseGuards(AuthenticatedGuard)
  async getGuilds(@AuthUser() user: User) {
    const guilds = await this.discordService.getActiveGuilds(user);

    return this.mapper.mapArray(guilds, PartialGuild, PartialGuildDto);
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
