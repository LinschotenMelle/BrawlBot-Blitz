import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '../../utils/constants';
import { OpenaiService } from '../services/openai.service';

export class CreateImageDto {
  prompt: string;
}

@Controller(Routes.OPENAI)
@ApiTags('OpenAI')
export class OpenaiController {
  constructor(
    @Inject(Services.OPENAI_SERVICE)
    private readonly openAIService: OpenaiService,
  ) {}

  @Post('/generate-image')
  //   @MultipleGuardsReferences(AuthenticatedGuard, TokenGuard)
  //   @UseGuards(MultipleAuthorizeGuard)
  async getChannels(@Body() { prompt }: CreateImageDto) {
    return this.openAIService.createImage(prompt);
  }
}
