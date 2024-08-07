import { UserDetailsDto } from '../../user/dto/User.dto';
import { User } from '../entities/User';

export interface IAuthService {
  validateUser(details: UserDetailsDto): Promise<User>;
}
