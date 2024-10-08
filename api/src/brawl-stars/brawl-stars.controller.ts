import { ApiOAuth2, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
import { BrawlStarsUser } from './entities/BrawlStarsUser';
import { BrawlStarsMapDto } from './dto/Map.dto';
import { PlayerDto, ClubDto } from './dto/Player.dto';
import { BrawlerDto } from './dto/Brawler.dto';
import {
  BrawlStarsUserDto,
  UpsertBrawlStarsUserDto,
} from './dto/BrawlStarsUser.dto';
import { InjectMapper } from '@timonmasberg/automapper-nestjs';
import { Mapper } from '@automapper/core';

@Controller(Routes.BRAWL_STARS)
@ApiTags('Brawl Stars')
@ApiOAuth2([])
export class BrawlStarsController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(Services.BRAWL_STARS_SERVICE)
    private readonly brawlStarsService: IBrawlStarsService,
  ) {}

  @Post('/save')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: BrawlStarsUserDto })
  async saveProfile(@Body() user: UpsertBrawlStarsUserDto) {
    const savedUser = await this.brawlStarsService.saveProfile(user);

    return this.mapper.map(savedUser, BrawlStarsUser, BrawlStarsUserDto);
  }

  @Put('/update')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: BrawlStarsUserDto })
  async updateProfile(@Body() user: UpsertBrawlStarsUserDto) {
    const updatedUser = await this.brawlStarsService.saveProfile(user);

    return this.mapper.map(updatedUser, BrawlStarsUser, BrawlStarsUserDto);
  }

  @Get('rotation')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [BrawlStarsMapDto] })
  async getRotation() {
    return this.brawlStarsService.getRotation();
  }

  @Get('profile/:userId')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: PlayerDto })
  async getProfile(@Param('userId') userId: string) {
    return this.brawlStarsService.getProfileByUserId(userId);
  }

  @Get('profile/:tag')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: PlayerDto })
  async getProfileByTag(@Param('tag') tag: string) {
    return this.brawlStarsService.getProfileByTag(tag);
  }

  @Get('brawlers')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [BrawlerDto] })
  async getBrawlers() {
    return this.brawlStarsService.getBrawlers();
  }

  @Get('clubs')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [ClubDto] })
  async getClubs(@Query('countryCode') countryCode?: string) {
    const language = countryCode ?? 'NL';
    return this.brawlStarsService.getClubs(language);
  }

  @Get('players')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: [PlayerDto] })
  async getPlayers(@Query('countryCode') countryCode?: string) {
    const language = countryCode ?? 'NL';
    return this.brawlStarsService.getPlayers(language);
  }
}
