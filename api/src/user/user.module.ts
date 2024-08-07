import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { User } from '../auth/entities/User';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
