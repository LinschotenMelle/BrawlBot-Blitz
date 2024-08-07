import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { YoutubeChannel } from './entities/YoutubeChannel';
import { TokenGuard } from '../auth/utils/Guards';
import { YoutubeVideoDto } from './dto/YoutubeVideo.dto';
import { YoutubeChannelDto } from './dto/YoutubeChannel.dto';
import { IYoutubeService } from './youtube.service';

@Controller(Routes.YOUTUBE)
@ApiTags('YouTube')
export class YoutubeController {
  constructor(
    @Inject(Services.YOUTUBE_SERVICE)
    private readonly youtubeService: IYoutubeService,
  ) {}

  @Post()
  @ApiResponse({ type: YoutubeChannel })
  async createChannel(@Body() youtubeChannel: YoutubeChannel) {
    return this.youtubeService.createChannel(youtubeChannel);
  }

  @Get('/channels')
  @ApiResponse({ type: [YoutubeChannelDto] })
  @UseGuards(TokenGuard)
  async getChannels() {
    const channels = await this.youtubeService.getChannels();
    const activeChannels = channels.filter((channel) => channel.isActive);

    return activeChannels.map((channel) => ({
      guildId: channel.guildId,
      guildChannelId: channel.guildChannelId,
      latestVideoDateTime: channel.latestVideoDateTime,
      roleId: channel.roleId,
    }));
  }

  @Get(':guildId')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: YoutubeChannel })
  async getChannel(@Param('guildId') guildId: string) {
    return this.youtubeService.getChannel(guildId);
  }

  @Put('/channels/:guildId')
  @UseGuards(TokenGuard)
  async updateChannel(
    @Param('guildId') guildId: string,
    @Body('latestVideoDateTime') latestVideoDateTime: string,
  ) {
    await this.youtubeService.updateChannel(
      guildId,
      new Date(latestVideoDateTime),
    );
  }

  @Get('/:guildId/search-latest-video')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: YoutubeVideoDto })
  async searchLatestVideo(@Param('guildId') guildId: string) {
    const channel = await this.youtubeService.getChannel(guildId);

    return this.youtubeService.searchLatestVideo(channel);
  }
}
