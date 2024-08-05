import { ApiProperty } from '@nestjs/swagger';

export type UserDetails = {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  avatar: string | null;
};

export type User = {
  id: string;
  discordId: string;
  avatar: string;
  username: string;
};

export class UpdateUserDetails {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
