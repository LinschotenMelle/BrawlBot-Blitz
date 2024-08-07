import { ApiProperty } from '@nestjs/swagger';

export class BrawlStarsUserDto {
  @ApiProperty()
  tag: number;
}

export class UpsertBrawlStarsUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  tag: string;
}
