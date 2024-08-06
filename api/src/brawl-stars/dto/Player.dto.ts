import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brawler } from './Brawler.dto';

export class Icon {
  @ApiProperty()
  id!: number;
}

export class BrawlStarsResponse {
  items!: any[];
}

export class Club {
  @ApiProperty()
  tag!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  badgeId?: number;

  @ApiPropertyOptional()
  trophies?: number;

  @ApiPropertyOptional()
  rank?: number;

  @ApiPropertyOptional()
  memberCount?: number;
}

export class BrawlStarsPlayer {
  @ApiProperty()
  tag!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  nameColor!: string;

  @ApiProperty()
  icon!: Icon;

  @ApiProperty()
  trophies!: number;

  @ApiPropertyOptional()
  highestTrophies?: number;

  @ApiPropertyOptional()
  highestPowerPlayPoints?: number;

  @ApiPropertyOptional()
  expLevel?: number;

  @ApiPropertyOptional()
  expPoints?: number;

  @ApiPropertyOptional()
  isQualifiedFromChampionshipChallenge?: boolean;

  @ApiPropertyOptional()
  '3vs3Victories'?: number;

  @ApiPropertyOptional()
  soloVictories?: number;

  @ApiPropertyOptional()
  duoVictories?: number;

  @ApiPropertyOptional()
  bestRoboRumbleTime?: number;

  @ApiPropertyOptional()
  bestTimeAsBigBrawler?: number;

  @ApiPropertyOptional({ type: Club })
  club?: Club;

  @ApiPropertyOptional({
    type: [Brawler],
  })
  brawlers?: Brawler[];
}
