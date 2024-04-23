import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IYoutubeService } from '../interfaces/youtube';
import { YoutubeChannel } from '../../utils/entities/YoutubeChannel';

@Controller(Routes.YOUTUBE)
@ApiTags('YouTube')
export class YoutubeController {
  constructor(
    @Inject(Services.YOUTUBE_SERVICE)
    private readonly youtubeService: IYoutubeService,
  ) {}

  @Get('/channels')
  @ApiResponse({ type: [YoutubeChannel] })
  async getChannels() {
    const channels = await this.youtubeService.getChannels();
    return channels.filter((channel) => channel.isActive);
  }

  @Put('/channels/:guildId')
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
