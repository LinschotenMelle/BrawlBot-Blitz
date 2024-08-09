import { ApiProperty } from '@nestjs/swagger';
import { WalletCollectableDto } from './WalletCollectable.dto';
import { AutoMap } from '@automapper/classes';

export class WalletDto {
  @ApiProperty()
  @AutoMap()
  userId: string;

  @ApiProperty()
  @AutoMap()
  coins: number;

  @ApiProperty()
  @AutoMap()
  powerpoints: number;

  @ApiProperty({
    type: WalletCollectableDto,
    isArray: true,
    default: [],
  })
  collectables: WalletCollectableDto[];
}
