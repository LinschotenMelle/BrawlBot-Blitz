import { User } from '../../utils/typeorm/entities/User';
import { UserDetails } from 'common/types/User';

export interface IAuthService {
  validateUser(details: UserDetails): Promise<User>;
}
