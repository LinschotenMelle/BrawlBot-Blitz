import { AxiosResponse } from 'axios';
import { PartialGuild } from '../../utils/types';

export interface IDiscordHttpService {
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
}
