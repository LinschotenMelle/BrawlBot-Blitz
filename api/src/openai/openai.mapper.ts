import { Injectable } from '@nestjs/common';
import { AutomapperProfile } from '@timonmasberg/automapper-nestjs';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { createMap, Mapper } from '@automapper/core';

@Injectable()
export class OpenaiMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {};
  }
}
