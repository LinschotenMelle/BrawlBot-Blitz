import { User } from '../../utils/typeorm/entities/User';
import { PartialGuild } from '../mapper/discord';

export interface IDiscordService {
  getActiveGuilds(user: User): Promise<PartialGuild[]>;
  getGuildDetails(guildId: string);
  getGuildChannels(guildId: string);
  getWelcomeMessage(guildId: string);
  postMemberCount(guildId: string, channelId: string);
  getMemberCount(guildId: string);
}
