import { ApiProperty } from '@nestjs/swagger';

export class GuildChannelDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: number;
}
