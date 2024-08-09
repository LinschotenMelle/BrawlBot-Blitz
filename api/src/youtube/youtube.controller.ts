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
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { Mapper } from '@automapper/core';
import { CreateYoutubeChannelDto } from './dto/CreateYoutubeChannel.dto';

@Controller(Routes.YOUTUBE)
@ApiTags('YouTube')
export class YoutubeController {
  constructor(
    @Inject(Services.YOUTUBE_SERVICE)
    private readonly youtubeService: IYoutubeService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Post()
  @ApiResponse({ type: YoutubeChannelDto })
  async createChannel(@Body() youtubeChannel: CreateYoutubeChannelDto) {
    const channel = await this.youtubeService.createChannel(youtubeChannel);

    return this.mapper.map(channel, YoutubeChannel, YoutubeChannelDto);
  }

  @Get('/channels')
  @ApiResponse({ type: [YoutubeChannelDto] })
  @UseGuards(TokenGuard)
  async getChannels() {
    const channels = await this.youtubeService.getChannels();
    const activeChannels = channels.filter((channel) => channel.isActive);

    return this.mapper.mapArray(
      activeChannels,
      YoutubeChannel,
      YoutubeChannelDto,
    );
  }

  @Get(':guildId')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: YoutubeChannelDto })
  async getChannel(@Param('guildId') guildId: string) {
    const channel = await this.youtubeService.getChannel(guildId);

    return this.mapper.map(channel, YoutubeChannel, YoutubeChannelDto);
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

    if (!channel || !channel.isActive) {
      return null;
    }

    return this.youtubeService.searchLatestVideo(channel);
  }
}
