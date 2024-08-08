import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { Services } from '../utils/constants';
import { DiscordStrategy } from './utils/DiscordStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { AuthController } from './auth.controller';
import { UserMapper } from '../user/user.mapper';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    SessionSerializer,
    {
      provide: Services.AUTH_SERVICE,
      useClass: AuthService,
    },
    UserMapper,
  ],
})
export class AuthModule {}
