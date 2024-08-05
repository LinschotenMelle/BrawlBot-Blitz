import { ApiProperty } from '@nestjs/swagger';

export class BrawlStarsEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  mode!: string;

  @ApiProperty()
  map!: string;
}
