import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDetails {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
