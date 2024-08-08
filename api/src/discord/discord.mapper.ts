import { Injectable } from '@nestjs/common';
import { AutomapperProfile } from '@timonmasberg/automapper-nestjs';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { createMap, Mapper } from '@automapper/core';
import { WelcomeMessage } from './entities/WelcomeMessage';
import { WelcomeMessageDto } from './dto/WelcomeMessage.dto';
import { GuildMemberCount } from './entities/GuildMemberCount';
import { GuildMemberCountDto } from './dto/GuildMemberCount.dto';

@Injectable()
export class DiscordMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, WelcomeMessage, WelcomeMessageDto);
      createMap(mapper, GuildMemberCount, GuildMemberCountDto);
    };
  }
}
