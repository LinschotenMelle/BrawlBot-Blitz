import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @AutoMap()
  discordId: string;

  @ApiProperty()
  @AutoMap()
  accessToken: string;

  @ApiProperty()
  @AutoMap()
  refreshToken: string;

  @ApiProperty()
  @AutoMap()
  username: string;

  @ApiProperty()
  @AutoMap()
  discriminator: string;

  @ApiProperty()
  @AutoMap()
  avatar: string | null;
}
