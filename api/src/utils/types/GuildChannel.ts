import { ApiProperty } from '@nestjs/swagger';

export class GuildChannel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: number;
}
