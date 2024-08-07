import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BrawlerDto } from './Brawler.dto';

export class IconDto {
  @ApiProperty()
  id!: number;
}

export class BrawlStarsResponse {
  items!: any[];
}

export class ClubDto {
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

export class PlayerDto {
  @ApiProperty()
  tag!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  nameColor!: string;

  @ApiProperty()
  icon!: IconDto;

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

  @ApiPropertyOptional({ type: ClubDto })
  club?: ClubDto;

  @ApiPropertyOptional({
    type: [BrawlerDto],
  })
  brawlers?: BrawlerDto[];
}
