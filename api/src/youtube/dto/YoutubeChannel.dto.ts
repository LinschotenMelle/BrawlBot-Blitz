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
}
