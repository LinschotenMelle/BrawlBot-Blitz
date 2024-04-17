import {
  Controller,
  Get,
  Post,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../utils/constants';
import { AuthenticatedGuard, DiscordAuthGuard } from '../utils/Guards';
import { Response } from 'express';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm/entities/User';
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(Routes.AUTH)
@ApiTags('Auth')
@ApiOAuth2([])
export class AuthController {
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
  @ApiResponse({ type: User })
  me(@AuthUser() user: User): User {
    return user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout() {
    return 'logout';
  }
}
