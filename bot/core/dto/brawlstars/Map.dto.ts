import { BrawlStarsEventDto } from "./Event.dto";

export class BrawlStarsMapDto {
  startTime!: string;
  endTime!: string;
  slotId!: number;
  event!: BrawlStarsEventDto;
}
