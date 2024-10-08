import { Module } from '@nestjs/common';
import { BrawlStarsController } from './brawl-stars.controller';
import { Services } from '../utils/constants';
import { BrawlStarsService } from './brawl-stars.service';
import { BrawlStarsUser } from './entities/BrawlStarsUser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrawlStarsMapper } from './brawl-stars.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([BrawlStarsUser])],
  controllers: [BrawlStarsController],
  providers: [
    {
      provide: Services.BRAWL_STARS_SERVICE,
      useClass: BrawlStarsService,
    },
    BrawlStarsMapper,
  ],
  exports: [],
})
export class BrawlStarsModule {}
