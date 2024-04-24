import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IYoutubeService } from '../interfaces/youtube';
import { YoutubeChannel } from '../../utils/entities/YoutubeChannel';
import { TokenGuard } from '../../auth/utils/Guards';

@Controller(Routes.YOUTUBE)
@ApiTags('YouTube')
export class YoutubeController {
  constructor(
    @Inject(Services.YOUTUBE_SERVICE)
    private readonly youtubeService: IYoutubeService,
  ) {}

  @Get('/channels')
  @ApiResponse({ type: [YoutubeChannel] })
  @UseGuards(TokenGuard)
  async getChannels() {
    const channels = await this.youtubeService.getChannels();
    return channels.filter((channel) => channel.isActive);
  }

  @Get(':guildId')
  @UseGuards(TokenGuard)
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
}
