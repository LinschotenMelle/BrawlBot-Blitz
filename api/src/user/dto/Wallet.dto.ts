import { ApiProperty } from '@nestjs/swagger';
import { WalletCollectableDto } from './WalletCollectable.dto';

export class WalletDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  coins: number;

  @ApiProperty()
  powerpoints: number;

  @ApiProperty({
    type: WalletCollectableDto,
    isArray: true,
    default: [],
  })
  collectables: WalletCollectableDto[];
}
