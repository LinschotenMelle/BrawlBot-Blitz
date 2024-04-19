import { Module } from '@nestjs/common';
import { DiscordController } from './controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { Services } from '../utils/constants';
import { DiscordHttpService } from './services/discord-http.service';
import { DiscordMapper } from './mapper/discord.mapper';

@Module({
  controllers: [DiscordController],
  providers: [
    DiscordMapper,
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
