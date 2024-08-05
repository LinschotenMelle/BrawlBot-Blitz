import { ApiProperty } from '@nestjs/swagger';
import { Role } from './Role';

export class Guild {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  splash: string | null;

  @ApiProperty()
  owner: boolean;

  @ApiProperty()
  permissions: number;

  @ApiProperty()
  features: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  roles: Role[];
}

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
