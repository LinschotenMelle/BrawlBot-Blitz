import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './Role.dto';

export class GuildDto {
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
  roles: RoleDto[];
}

export class PartialGuildDto {
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
