import { ApiProperty } from '@nestjs/swagger';

export class WalletCollectableDto {
  @ApiProperty()
  collectableId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  imageUrl: string;
}
