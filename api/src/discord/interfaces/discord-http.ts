import { AxiosResponse } from 'axios';
import { Guild } from 'common/types/Guild';
import { GuildChannel } from 'common/types/GuildChannel';
import { PartialGuild } from '../mapper/discord';

export interface IDiscordHttpService {
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
  fetchGuildDetails(guildId: string): Promise<AxiosResponse<Guild>>;
  fetchGuildChannels(guildId: string): Promise<AxiosResponse<GuildChannel[]>>;
}
