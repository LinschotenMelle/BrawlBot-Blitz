import { ApiProperty } from '@nestjs/swagger';

export class YoutubeChannelDto {
  @ApiProperty()
  guildId: string;

  @ApiProperty()
  guildChannelId: string;

  @ApiProperty()
  latestVideoDateTime: string;

  @ApiProperty()
  roleId: string;
}
