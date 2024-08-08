import { Injectable } from '@nestjs/common';
import { AutomapperProfile } from '@timonmasberg/automapper-nestjs';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { YoutubeChannelDto } from './dto/YoutubeChannel.dto';
import { YoutubeChannel } from './entities/YoutubeChannel';

@Injectable()
export class YoutubeMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        YoutubeChannel,
        YoutubeChannelDto,
        forMember(
          (y) => y.latestVideoDateTime,
          mapFrom((c) => c.latestVideoDateTime.toISOString()),
        ),
      );
    };
  }
}
