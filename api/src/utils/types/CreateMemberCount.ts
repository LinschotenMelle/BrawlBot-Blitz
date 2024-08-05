import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberCount {
  @ApiProperty()
  channelId: string;
}
