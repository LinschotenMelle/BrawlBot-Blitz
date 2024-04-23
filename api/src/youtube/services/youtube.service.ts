import { Injectable } from '@nestjs/common';
import { IYoutubeService } from '../interfaces/youtube';
import { YoutubeChannel } from '../../utils/entities/YoutubeChannel';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class YoutubeService implements IYoutubeService {
  constructor(
    @InjectRepository(YoutubeChannel)
    private readonly youtubeRepository: Repository<YoutubeChannel>,
  ) {}

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
}
