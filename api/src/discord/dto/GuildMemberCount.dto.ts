import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class GuildMemberCountDto {
  @ApiProperty()
  @AutoMap()
  guildId: string;

  @ApiProperty()
  @AutoMap()
  channelId: string;
}
