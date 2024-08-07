import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { User } from '../../user/entities/User';
import { IUserService } from '../../user/user.service';

export type Done = (error: Error, user: User) => void;

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USER_SERVICE) private readonly userService: IUserService,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(payload: User, done: Done) {
    try {
      const userDB = await this.userService.findUser(payload.discordId);

      return userDB ? done(null, userDB) : done(null, null);
    } catch (error) {
      return done(error, null);
    }
  }
}
