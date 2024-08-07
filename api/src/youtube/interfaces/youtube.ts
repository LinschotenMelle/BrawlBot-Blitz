import { YoutubeChannel } from '../entities/YoutubeChannel';
import { YoutubeVideoDto } from '../dto/YoutubeVideo.dto';

export interface IYoutubeService {
  createChannel(youtubeChannel: YoutubeChannel): Promise<YoutubeChannel>;
  getChannels(): Promise<YoutubeChannel[]>;
  updateChannel(guildId: string, dateTime: Date): Promise<void>;
  getChannel(guildId: string): Promise<YoutubeChannel>;
  searchLatestVideo(channel: YoutubeChannel): Promise<YoutubeVideoDto>;
}
