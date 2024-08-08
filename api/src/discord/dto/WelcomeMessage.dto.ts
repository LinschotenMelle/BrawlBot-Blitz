import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class WelcomeMessageDto {
  @ApiProperty()
  @AutoMap()
  guildId: string;

  @ApiProperty()
  @AutoMap()
  channelId: string;
}
