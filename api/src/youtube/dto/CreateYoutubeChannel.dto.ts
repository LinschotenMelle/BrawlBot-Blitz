import { ApiProperty } from '@nestjs/swagger';

export class CreateYoutubeChannelDto {
  @ApiProperty()
  guildId: string;

  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  guildChannelId: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  latestVideoDateTime: string;

  @ApiProperty()
  isActive: boolean;
}
