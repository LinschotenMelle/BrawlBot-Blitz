import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brawler } from './Brawler.dto';

export class Icon {
  @ApiProperty()
  id!: number;
}

export class ClubResponse {
  items!: Club[];
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

  @ApiProperty()
  highestTrophies!: number;

  @ApiProperty()
  highestPowerPlayPoints!: number;

  @ApiProperty()
  expLevel!: number;

  @ApiProperty()
  expPoints!: number;

  @ApiProperty()
  isQualifiedFromChampionshipChallenge!: boolean;

  @ApiProperty()
  '3vs3Victories'!: number;

  @ApiProperty()
  soloVictories!: number;

  @ApiProperty()
  duoVictories!: number;

  @ApiProperty()
  bestRoboRumbleTime!: number;

  @ApiProperty()
  bestTimeAsBigBrawler!: number;

  @ApiProperty({ type: Club })
  club?: Club;

  @ApiProperty({
    type: [Brawler],
  })
  brawlers!: Brawler[];
}
