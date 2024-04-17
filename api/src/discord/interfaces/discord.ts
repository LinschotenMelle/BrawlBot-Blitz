import { User } from '../../utils/typeorm/entities/User';

export interface IDiscordService {
  getActiveGuilds(user: User);
}
