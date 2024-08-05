import { ApiProperty } from '@nestjs/swagger';

export class BrawlerResponse {
  items!: Brawler[];
}

export class Gear {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: number;
}

export class StarPower {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class Gadget {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class Brawler {
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
  gears!: Gear[];

  @ApiProperty()
  starPowers!: StarPower[];

  @ApiProperty()
  gadgets!: Gadget[];
}
