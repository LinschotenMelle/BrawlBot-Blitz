import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class YoutubeChannelDto {
  @ApiProperty()
  guildId: string;

  @ApiProperty()
  guildChannelId: string;

  @ApiPropertyOptional()
  latestVideoDateTime: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  @AutoMap()
  isActive: boolean;
}
