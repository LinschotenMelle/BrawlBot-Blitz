import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard, DiscordAuthGuard } from './utils/Guards';
import { Routes } from '../utils/constants';
import { User } from '../user/entities/User';
import { AuthUser } from '../utils/decorators';
import { InjectMapper } from '../common/decorators/inject-mapper.decorator';
import { Mapper } from '@automapper/core';
import { UserDto } from '../user/dto/User.dto';

@Controller(Routes.AUTH)
@ApiTags('Auth')
@ApiOAuth2([])
export class AuthController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Get('login')
  @UseGuards(DiscordAuthGuard)
  login() {
    return '';
  }

  @Get('redirect')
  @UseGuards(DiscordAuthGuard)
  redirect(@Res() res: Response) {
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ type: UserDto })
  me(@AuthUser() user: User) {
    return this.mapper.map(user, User, UserDto);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('connect.sid');
    res.redirect(process.env.CORS_ORIGIN);
  }
}
