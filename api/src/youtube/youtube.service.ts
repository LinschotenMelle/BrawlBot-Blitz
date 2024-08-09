import { Injectable } from '@nestjs/common';
import { YoutubeChannel } from './entities/YoutubeChannel';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YoutubeVideoDto } from './dto/YoutubeVideo.dto';
import { CreateYoutubeChannelDto } from './dto/CreateYoutubeChannel.dto';
import * as Parser from 'rss-parser';

export interface IYoutubeService {
  createChannel(
    youtubeChannel: CreateYoutubeChannelDto,
  ): Promise<YoutubeChannel>;
  getChannels(): Promise<YoutubeChannel[]>;
  updateChannel(guildId: string, dateTime: Date): Promise<void>;
  getChannel(guildId: string): Promise<YoutubeChannel>;
  searchLatestVideo(channel: YoutubeChannel): Promise<YoutubeVideoDto>;
}

@Injectable()
export class YoutubeService implements IYoutubeService {
  private readonly baseURL = 'https://www.youtube.com/feeds/videos.xml';
  private readonly parser: Parser;

  constructor(
    @InjectRepository(YoutubeChannel)
    private readonly youtubeRepository: Repository<YoutubeChannel>,
  ) {
    this.parser = new Parser();
  }

  async createChannel(
    youtubeChannel: CreateYoutubeChannelDto,
  ): Promise<YoutubeChannel> {
    const channel = new YoutubeChannel();
    Object.assign(channel, {
      ...youtubeChannel,
      latestVideoDateTime: Date.parse(youtubeChannel.latestVideoDateTime),
    });

    return this.youtubeRepository.save(channel);
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
    const rss = await this.parser.parseURL(
      `${this.baseURL}?channel_id=${channel.channelId}`,
    );

    const latestVideo = rss.items[0];

    return {
      id: latestVideo.id.split(':')[2],
      videoTitle: latestVideo.title,
      videoUrl: latestVideo.link,
      description: latestVideo.content,
      publishedAt: latestVideo.pubDate,
      thumbnailUrl: latestVideo.thumbnail,
      channelId: channel.channelId,
      channelTitle: rss.title,
    };
  }
}
