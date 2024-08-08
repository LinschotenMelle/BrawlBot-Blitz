import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { Services } from '../utils/constants';
import { DiscordHttpService } from './discord-http.service';
import { WelcomeMessage } from './entities/WelcomeMessage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticatedGuard, TokenGuard } from '../auth/utils/Guards';
import { GuildMemberCount } from './entities/GuildMemberCount';
import { DiscordMapper } from './discord.mapper';

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
    DiscordMapper,
  ],
})
export class DiscordModule {}
