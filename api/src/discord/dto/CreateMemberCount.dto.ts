import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberCountDto {
  @ApiProperty()
  channelId: string;
}
