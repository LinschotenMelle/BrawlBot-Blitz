import { User } from '../../auth/entities/User';
import { UpdateUserDetailsDto } from '../dto/UpdateUserDetails.dto';
import { UserDetailsDto } from '../dto/User.dto';

export interface IUserService {
  createUser(details: UserDetailsDto): Promise<User>;
  findUser(discordId: string): Promise<User | undefined>;
  updateUser(user: User, details: UpdateUserDetailsDto): Promise<User>;
}
