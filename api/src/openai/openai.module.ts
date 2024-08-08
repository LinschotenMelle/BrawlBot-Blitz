import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { Services } from '../utils/constants';
import { AuthenticatedGuard } from '../auth/utils/Guards';
import { OpenaiMapper } from './openai.mapper';

@Module({
  controllers: [OpenaiController],
  providers: [
    {
      provide: Services.OPENAI_SERVICE,
      useClass: OpenaiService,
    },
    AuthenticatedGuard,
    OpenaiMapper,
  ],
})
export class OpenaiModule {}
