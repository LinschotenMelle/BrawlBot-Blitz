import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '../utils/constants';
import {
  Body,
  Controller,
  Get,
  Head,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokenGuard } from '../auth/utils/Guards';
import { IBrawlStarsService } from './brawl-stars.service';
import { BrawlStarsUser } from '../utils/entities/BrawlStarsUser';
import { BrawlStarsMapDto } from './dto/Map.dto';
import { BrawlStarsPlayer, Club } from './dto/Player.dto';
import { Brawler } from './dto/Brawler.dto';

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
  @ApiResponse({ type: BrawlStarsUser })
  async saveProfile(@Body() user: BrawlStarsUser) {
    return this.brawlStarsService.saveProfile(user);
  }

  @Put('/update')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: BrawlStarsUser })
  async updateProfile(@Body() user: BrawlStarsUser) {
    return this.brawlStarsService.saveProfile(user);
  }

  @Get('rotation')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [BrawlStarsMapDto] })
  async getRotation() {
    return this.brawlStarsService.getRotation();
  }

  @Get('profile/:userId')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: BrawlStarsPlayer })
  async getProfile(@Param('userId') userId: string) {
    return this.brawlStarsService.getProfileByUserId(userId);
  }

  @Get('profile/:tag')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: BrawlStarsPlayer })
  async getProfileByTag(@Param('tag') tag: string) {
    return this.brawlStarsService.getProfileByTag(tag);
  }

  @Get('brawlers')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [Brawler] })
  async getBrawlers() {
    return this.brawlStarsService.getBrawlers();
  }

  @Get('clubs')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [Club] })
  async getClubs(@Query('countryCode') countryCode?: string) {
    const language = countryCode ?? 'NL';
    return this.brawlStarsService.getClubs(language);
  }

  @Get('players')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [BrawlStarsPlayer] })
  async getPlayers(@Query('countryCode') countryCode?: string) {
    const language = countryCode ?? 'NL';
    return this.brawlStarsService.getPlayers(language);
  }
}
