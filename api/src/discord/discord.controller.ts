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
import { PartialGuild } from '../utils/types/discord';
import { WelcomeMessage } from '../utils/entities/WelcomeMessage';
import { GuildChannel } from '../utils/types/GuildChannel';

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
  @ApiResponse({ type: [PartialGuild] })
  async getGuilds(@AuthUser() user: User) {
    return this.discordService.getActiveGuilds(user);
  }

  @Get('/guilds/:guildId')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: PartialGuild })
  getGuildDetails(@Param('guildId') guildId: string) {
    return this.discordService.getGuildDetails(guildId);
  }

  @Get('/guilds/:guildId/channels')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: [GuildChannel] })
  getGuildChannels(@Param('guildId') guildId: string) {
    return this.discordService.getGuildChannels(guildId);
  }

  @Get('/guilds/:guildId/welcome-message')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: WelcomeMessage })
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
