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
import { GuildDto, PartialGuildDto } from './dto/Guild.dto';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { Mapper } from '@automapper/core';
import { WelcomeMessageDto } from './dto/WelcomeMessage.dto';
import { GuildMemberCountDto } from './dto/GuildMemberCount.dto';

@Controller(Routes.DISCORD)
@ApiTags('Discord')
@ApiOAuth2([])
export class DiscordController {
  constructor(
    @Inject(Services.DISCORD_SERVICE)
    private readonly discordService: IDiscordService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Get('/guilds')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: [PartialGuildDto] })
  async getGuilds(@AuthUser() user: User) {
    return this.discordService.getActiveGuilds(user);
  }

  @Get('/guilds/:guildId')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: GuildDto })
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
  @ApiResponse({ type: WelcomeMessageDto })
  async getWelcomeMessage(@Param('guildId') guildId: string) {
    const welcomeMessage = await this.discordService.getWelcomeMessage(guildId);

    return this.mapper.map(welcomeMessage, WelcomeMessage, WelcomeMessageDto);
  }

  @Post('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCountDto })
  @UseGuards(TokenGuard)
  async postMemberCount(
    @Param('guildId') guildId: string,
    @Body() { channelId }: CreateMemberCountDto,
  ) {
    const memberCount = await this.discordService.postMemberCount(
      guildId,
      channelId,
    );

    return this.mapper.map(memberCount, GuildMemberCount, GuildMemberCountDto);
  }

  @Get('/guilds/:guildId/member-count')
  @ApiResponse({ type: GuildMemberCountDto })
  @UseGuards(TokenGuard)
  async getMemberCount(@Param('guildId') guildId: string) {
    const memberCount = await this.discordService.getMemberCount(guildId);

    return this.mapper.map(memberCount, GuildMemberCount, GuildMemberCountDto);
  }

  // @Post('/guilds/:guildId/ticket-system')
  // @UseGuards(TokenGuard)
  // async createTicketSystem() {
  //   return this.discordService.createTicketSystem();
  // }
}
