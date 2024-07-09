import { Module } from '@nestjs/common';
import { OpenaiController } from './controllers/openai.controller';
import { OpenaiService } from './services/openai.service';
import { Services } from '../utils/constants';
import { AuthenticatedGuard } from '../auth/utils/Guards';

@Module({
  controllers: [OpenaiController],
  providers: [
    {
      provide: Services.OPENAI_SERVICE,
      useClass: OpenaiService,
    },
    AuthenticatedGuard,
  ],
})
export class OpenaiModule {}
