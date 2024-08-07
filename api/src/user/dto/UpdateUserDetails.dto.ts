import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDetailsDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
