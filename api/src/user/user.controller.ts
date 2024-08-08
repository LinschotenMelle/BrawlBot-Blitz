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
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { Mapper } from '@automapper/core';
import { UserWallet } from './entities/UserWallet';

@Controller(Routes.USER)
@ApiTags('User')
export class UserController {
  constructor(
    @Inject(Services.USER_SERVICE)
    private readonly userService: UserService,
    @InjectMapper()
    private readonly mapper: Mapper,
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

    return this.mapper.map(wallet, UserWallet, WalletDto);
  }

  @Get('/:userId/balance')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: WalletDto })
  async getWalletBalance(@Param('userId') userId: string) {
    const wallet = await this.userService.getWalletBalance(userId);

    return this.mapper.map(wallet, UserWallet, WalletDto);
  }
}
