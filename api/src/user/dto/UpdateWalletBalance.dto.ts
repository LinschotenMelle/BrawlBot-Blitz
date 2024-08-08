import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletBalanceDto {
  @ApiProperty()
  coins: number;

  @ApiProperty()
  powerpoints: number;
}
