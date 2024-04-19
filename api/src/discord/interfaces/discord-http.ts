import { AxiosResponse } from 'axios';
import { Guild, PartialGuild } from 'common/types/Guild';

export interface IDiscordHttpService {
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
  fetchGuildDetails(guildId: string): Promise<AxiosResponse<Guild>>;
}
