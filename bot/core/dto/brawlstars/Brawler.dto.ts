interface Gear {
  id: number;
  name: string;
  level: number;
}

interface StarPower {
  id: number;
  name: string;
}

interface Gadget {
  id: number;
  name: string;
}

export class BrawlerResponse {
  items!: Brawler[];
}

export class Brawler {
  id!: number;
  name!: string;
  power!: number;
  rank!: number;
  trophies!: number;
  highestTrophies!: number;
  gears!: Gear[];
  starPowers!: StarPower[];
  gadgets!: Gadget[];
}
