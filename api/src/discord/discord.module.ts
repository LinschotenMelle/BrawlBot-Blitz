import { Module } from '@nestjs/common';
import { DiscordController } from './controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { Services } from '../utils/constants';
import { DiscordHttpService } from './services/discord-http.service';
import { WelcomeMessage } from '../utils/entities/WelcomeMessage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticatedGuard, TokenGuard } from '../auth/utils/Guards';
import { GuildMemberCount } from '../utils/entities/GuildMemberCount';

@Module({
  imports: [TypeOrmModule.forFeature([WelcomeMessage, GuildMemberCount])],
  controllers: [DiscordController],
  providers: [
    {
      provide: Services.DISCORD_SERVICE,
      useClass: DiscordService,
    },
    {
      provide: Services.DISCORD_HTTP_SERVICE,
      useClass: DiscordHttpService,
    },
    TokenGuard,
  ],
})
export class DiscordModule {}
