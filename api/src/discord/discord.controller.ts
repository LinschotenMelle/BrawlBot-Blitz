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
import { AuthenticatedGuard, TokenGuard } from '../auth/utils/Guards';
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberCountDto } from './dto/CreateMemberCount.dto';
import { GuildMemberCount } from './entities/GuildMemberCount';
import { IDiscordService } from './discord.service';
import { WelcomeMessage } from './entities/WelcomeMessage';
import { GuildChannelDto } from './dto/GuildChannel.dto';
import { User } from '../user/entities/User';
import { PartialGuildDto } from './dto/Guild.dto';

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
  @ApiResponse({ type: [PartialGuildDto] })
  async getGuilds(@AuthUser() user: User) {
    return this.discordService.getActiveGuilds(user);
  }

  @Get('/guilds/:guildId')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: PartialGuildDto })
  async getGuildDetails(@Param('guildId') guildId: string) {
    return this.discordService.getGuildDetails(guildId);
  }

  @Get('/guilds/:guildId/channels')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: [GuildChannelDto] })
  async getGuildChannels(@Param('guildId') guildId: string) {
    return this.discordService.getGuildChannels(guildId);
  }

  @Get('/guilds/:guildId/welcome-message')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: WelcomeMessage })
  async getWelcomeMessage(@Param('guildId') guildId: string) {
    return this.discordService.getWelcomeMessage(guildId);
  }

  @Post('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCount })
  @UseGuards(TokenGuard)
  async postMemberCount(
    @Param('guildId') guildId: string,
    @Body() { channelId }: CreateMemberCountDto,
  ) {
    return this.discordService.postMemberCount(guildId, channelId);
  }

  @Get('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCount })
  @UseGuards(TokenGuard)
  async getMemberCount(@Param('guildId') guildId: string) {
    return this.discordService.getMemberCount(guildId);
  }

  // @Post('/guilds/:guildId/ticket-system')
  // @UseGuards(TokenGuard)
  // async createTicketSystem() {
  //   return this.discordService.createTicketSystem();
  // }
}
