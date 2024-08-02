import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm/entities/User';
import { AuthenticatedGuard, TokenGuard } from '../auth/utils/Guards';
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberCount } from '../utils/types/CreateMemberCount';
import { GuildMemberCount } from '../utils/entities/GuildMemberCount';
import { IDiscordService } from './discord.service';

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

  @Get('/guilds/:guildId/welcome-message')
  @UseGuards(TokenGuard)
  getWelcomeMessage(@Param('guildId') guildId: string) {
    return this.discordService.getWelcomeMessage(guildId);
  }

  @Post('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCount })
  @UseGuards(TokenGuard)
  postMemberCount(
    @Param('guildId') guildId: string,
    @Body() { channelId }: CreateMemberCount,
  ) {
    return this.discordService.postMemberCount(guildId, channelId);
  }

  @Get('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCount })
  @UseGuards(TokenGuard)
  getMemberCount(@Param('guildId') guildId: string) {
    return this.discordService.getMemberCount(guildId);
  }
}
