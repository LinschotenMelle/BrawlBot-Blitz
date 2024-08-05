import { ApiProperty } from '@nestjs/swagger';

export class PartialGuild {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  owner: boolean;

  @ApiProperty()
  permissions: number;

  @ApiProperty()
  features: string[];

  @ApiProperty()
  isActive: boolean;
}
