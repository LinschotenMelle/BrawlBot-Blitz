import { Module } from '@nestjs/common';
import { DiscordController } from './controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { Services } from '../utils/constants';
import { DiscordHttpService } from './services/discord-http.service';

@Module({
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
  ],
})
export class DiscordModule {}
