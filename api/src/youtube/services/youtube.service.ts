import { Injectable } from '@nestjs/common';
import { IYoutubeService } from '../interfaces/youtube';
import { YoutubeChannel } from '../entities/YoutubeChannel';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { YoutubeVideoDto } from '../dto/YoutubeVideo.dto';

@Injectable()
export class YoutubeService implements IYoutubeService {
  private readonly axios: AxiosInstance;

  constructor(
    @InjectRepository(YoutubeChannel)
    private readonly youtubeRepository: Repository<YoutubeChannel>,
  ) {
    this.axios = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
    });
  }

  async createChannel(youtubeChannel: YoutubeChannel): Promise<YoutubeChannel> {
    return this.youtubeRepository.save(youtubeChannel);
  }

  async getChannels(): Promise<YoutubeChannel[]> {
    return this.youtubeRepository.find();
  }

  async updateChannel(guildId: string, dateTime: Date): Promise<void> {
    try {
      await this.youtubeRepository.update(guildId, {
        latestVideoDateTime: dateTime,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async getChannel(guildId: string): Promise<YoutubeChannel> {
    return this.youtubeRepository.findOneBy({
      guildId: guildId,
    });
  }

  async searchLatestVideo(channel: YoutubeChannel): Promise<YoutubeVideoDto> {
    const response = await this.axios.get('/search', {
      params: {
        key: channel.apiKey,
        channelId: channel.channelId,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: 1,
      },
    });

    return response.data.items[0];
  }
}
