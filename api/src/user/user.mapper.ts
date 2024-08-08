import { Injectable } from '@nestjs/common';
import { AutomapperProfile } from '@timonmasberg/automapper-nestjs';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { UserWallet } from './entities/UserWallet';
import { WalletDto } from './dto/Wallet.dto';
import { WalletCollectableDto } from './dto/WalletCollectable.dto';
import { UserWalletCollectable } from './entities/UserWalletCollectable';
import { User } from './entities/User';
import { UserDto } from './dto/User.dto';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, User, UserDto);
      createMap(
        mapper,
        UserWallet,
        WalletDto,
        forMember(
          (w) => w.collectables,
          mapFrom((u) =>
            this.mapper.mapArray(
              u.collectables,
              UserWalletCollectable,
              WalletCollectableDto,
            ),
          ),
        ),
      );
      createMap(mapper, UserWalletCollectable, WalletCollectableDto);
    };
  }
}
