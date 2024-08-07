import { Module } from '@nestjs/common';
import { YoutubeController } from './controllers/youtube.controller';
import { Services } from '../utils/constants';
import { YoutubeService } from './services/youtube.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeChannel } from './entities/YoutubeChannel';
import { AuthenticatedGuard } from '../auth/utils/Guards';

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeChannel])],
  controllers: [YoutubeController],
  providers: [
    {
      provide: Services.YOUTUBE_SERVICE,
      useClass: YoutubeService,
    },
    AuthenticatedGuard,
  ],
})
export class YoutubeModule {}
