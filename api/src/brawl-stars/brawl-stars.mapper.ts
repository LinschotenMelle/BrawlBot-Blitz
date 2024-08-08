import { Injectable } from '@nestjs/common';
import { AutomapperProfile } from '@timonmasberg/automapper-nestjs';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { createMap, Mapper } from '@automapper/core';
import { BrawlStarsUserDto } from './dto/BrawlStarsUser.dto';
import { BrawlStarsUser } from './entities/BrawlStarsUser';

@Injectable()
export class BrawlStarsMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, BrawlStarsUser, BrawlStarsUserDto);
    };
  }
}
