import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '../utils/constants';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TokenGuard } from '../auth/utils/Guards';
import { IBrawlStarsService } from './brawl-stars.service';
import { BrawlStarsUser } from '../utils/entities/BrawlStarsUser';

@Controller(Routes.BRAWL_STARS)
@ApiTags('Brawl Stars')
@ApiOAuth2([])
export class BrawlStarsController {
  constructor(
    @Inject(Services.BRAWL_STARS_SERVICE)
    private readonly brawlStarsService: IBrawlStarsService,
  ) {}

  @Post('/save')
  @UseGuards(TokenGuard)
  async saveProfile(@Body() user: BrawlStarsUser) {
    return this.brawlStarsService.saveProfile(user);
  }

  @Put('/update')
  @UseGuards(TokenGuard)
  async updateProfile(@Body() user: BrawlStarsUser) {
    return this.brawlStarsService.saveProfile(user);
  }

  @Get('profile/:userId')
  @UseGuards(TokenGuard)
  async getProfile(@Param('userId') userId: string) {
    return this.brawlStarsService.getProfile(userId);
  }
}
