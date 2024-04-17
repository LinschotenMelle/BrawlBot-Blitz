import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../../user/interfaces/user';
import { Services } from '../../utils/constants';
import { IAuthService } from '../interfaces/auth';
import { UserDetails } from '../../utils/types';
import { User } from '../../utils/typeorm/entities/User';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER_SERVICE) private readonly userService: IUserService,
  ) {}

  async validateUser(details: UserDetails): Promise<User> {
    const user = await this.userService.findUser(details.discordId);
    return user || this.userService.createUser(details);
  }
}
