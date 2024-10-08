import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class BrawlStarsUserDto {
  @ApiProperty()
  @AutoMap()
  tag: number;
}

export class UpsertBrawlStarsUserDto {
  @ApiProperty()
  @AutoMap()
  userId: string;

  @ApiProperty()
  @AutoMap()
  tag: string;
}
