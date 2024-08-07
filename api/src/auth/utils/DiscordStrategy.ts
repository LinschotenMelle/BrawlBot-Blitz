import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Services } from '../../utils/constants';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly configModule: ConfigService,
  ) {
    super({
      clientID: configModule.getOrThrow('DISCORD_CLIENT_ID'),
      clientSecret: configModule.getOrThrow('DISCORD_CLIENT_SECRET'),
      callbackURL: configModule.getOrThrow('DISCORD_REDIRECT_URL'),
      scope: ['identify', 'email', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.authService.validateUser({
      discordId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      discriminator: profile.discriminator,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
