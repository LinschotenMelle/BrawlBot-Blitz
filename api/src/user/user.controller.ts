import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '../utils/constants';
import { UserService } from './user.service';
import { TokenGuard } from '../auth/utils/Guards';
import { UpdateWalletBalanceDto } from './dto/UpdateWalletBalance.dto';
import { WalletDto } from './dto/Wallet.dto';

@Controller(Routes.USER)
@ApiTags('User')
export class UserController {
  constructor(
    @Inject(Services.USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  @Put('/:userId/balance')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: WalletDto })
  async updateWalletBalance(
    @Param('userId') userId: string,
    @Body() { coins, powerpoints }: UpdateWalletBalanceDto,
  ) {
    const wallet = await this.userService.updateWalletBalance(
      userId,
      coins,
      powerpoints,
    );

    return {
      userId: wallet.userId,
      coins: wallet.coins,
      powerpoints: wallet.powerpoints,
      collectables: wallet.collectables,
    };
  }

  @Get('/:userId/balance')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: WalletDto })
  async getWalletBalance(@Param('userId') userId: string) {
    const wallet = await this.userService.getWalletBalance(userId);

    return {
      userId: wallet.userId,
      coins: wallet.coins,
      powerpoints: wallet.powerpoints,
      collectables: wallet.collectables,
    };
  }
}
