import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Routes } from '../../utils/constants';
import { AuthenticatedGuard, DiscordAuthGuard } from '../utils/Guards';
import { Response } from 'express';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm/entities/User';

@Controller(Routes.AUTH)
export class AuthController {
  @Get('login')
  @UseGuards(DiscordAuthGuard)
  login() {
    return '';
  }

  @Get('redirect')
  @UseGuards(DiscordAuthGuard)
  redirect(@Res() res: Response) {
    res.redirect(`${process.env.CORS_ORIGIN}/menu`);
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  me(@AuthUser() user: User) {
    return user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout() {
    return 'logout';
  }
}
