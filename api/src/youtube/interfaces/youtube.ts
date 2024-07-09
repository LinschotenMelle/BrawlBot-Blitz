import { YoutubeChannel } from '../../utils/entities/YoutubeChannel';

export interface IYoutubeService {
  createChannel(youtubeChannel: YoutubeChannel): Promise<YoutubeChannel>;
  getChannels(): Promise<YoutubeChannel[]>;
  updateChannel(guildId: string, dateTime: Date): Promise<void>;
  getChannel(guildId: string): Promise<YoutubeChannel>;
}
