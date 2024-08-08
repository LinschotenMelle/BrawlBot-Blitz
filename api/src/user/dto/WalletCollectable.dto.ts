import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class WalletCollectableDto {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  price: number;

  @ApiProperty()
  @AutoMap()
  imageUrl: string;
}
