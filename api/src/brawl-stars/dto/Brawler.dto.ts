import { ApiProperty } from '@nestjs/swagger';

export class GearDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: number;
}

export class StarPowerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GadgetDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class BrawlerDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  power!: number;

  @ApiProperty()
  rank!: number;

  @ApiProperty()
  trophies!: number;

  @ApiProperty()
  highestTrophies!: number;

  @ApiProperty()
  gears!: GearDto[];

  @ApiProperty()
  starPowers!: StarPowerDto[];

  @ApiProperty()
  gadgets!: GadgetDto[];
}
