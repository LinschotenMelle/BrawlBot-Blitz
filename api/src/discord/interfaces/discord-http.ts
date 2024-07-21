import { AxiosResponse } from 'axios';
import { PartialGuild } from '../mapper/discord';
import { Guild } from '../../utils/types/Guild';
import { GuildChannel } from '../../utils/types/GuildChannel';
import { WelcomeMessage } from '../../utils/entities/WelcomeMessage';
import { GuildMemberCount } from '../../utils/entities/GuildMemberCount';

export interface IDiscordHttpService {
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
  fetchGuildDetails(guildId: string): Promise<AxiosResponse<Guild>>;
  fetchGuildChannels(guildId: string): Promise<AxiosResponse<GuildChannel[]>>;
  getWelcomeMessage(guildId: string): Promise<WelcomeMessage>;
  postMemberCount(guildId: string, channelId: string): Promise<void>;
  getMemberCount(guildId: string): Promise<GuildMemberCount>;
}
