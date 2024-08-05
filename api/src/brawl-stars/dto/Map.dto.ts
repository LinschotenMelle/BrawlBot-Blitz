import { ApiProperty } from '@nestjs/swagger';
import { BrawlStarsEventDto } from './Event.dto';

export class BrawlStarsMapDto {
  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty()
  slotId!: number;

  @ApiProperty()
  event!: BrawlStarsEventDto;
}
