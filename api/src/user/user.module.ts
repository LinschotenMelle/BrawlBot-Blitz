import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { User } from './entities/User';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserWallet } from './entities/UserWallet';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserWallet])],
  controllers: [UserController],
  providers: [
    {
      provide: Services.USER_SERVICE,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: Services.USER_SERVICE,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
