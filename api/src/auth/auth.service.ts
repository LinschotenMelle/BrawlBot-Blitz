import { Inject, Injectable } from '@nestjs/common';
import { Services } from '../utils/constants';
import { UserDetailsDto } from '../user/dto/User.dto';
import { User } from '../user/entities/User';
import { IUserService } from '../user/user.service';

export interface IAuthService {
  validateUser(details: UserDetailsDto): Promise<User>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER_SERVICE) private readonly userService: IUserService,
  ) {}

  async validateUser(details: UserDetailsDto): Promise<User> {
    const user = await this.userService.findUser(details.discordId);
    const { discordId, ...rest } = details;
    return user
      ? this.userService.updateUser(user, rest)
      : this.userService.createUser(details);
  }
}
