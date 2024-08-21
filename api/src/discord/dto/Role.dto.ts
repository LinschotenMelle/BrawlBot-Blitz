import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissions: string;

  @ApiProperty()
  color: number;
}
