import { YoutubeChannel } from '../../utils/entities/YoutubeChannel';

export interface IYoutubeService {
  getChannels(): Promise<YoutubeChannel[]>;
  updateChannel(guildId: string, dateTime: Date): Promise<void>;
}
