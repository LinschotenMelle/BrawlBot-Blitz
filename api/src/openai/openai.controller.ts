import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '../utils/constants';
import { OpenaiService } from './openai.service';
import { TokenGuard } from '../auth/utils/Guards';
import { CreateImageDto, ImageDto } from './dto/image.dto';

@Controller(Routes.OPENAI)
@ApiTags('OpenAI')
export class OpenaiController {
  constructor(
    @Inject(Services.OPENAI_SERVICE)
    private readonly openAIService: OpenaiService,
  ) {}

  @Post('/generate-image')
  @UseGuards(TokenGuard)
  @ApiResponse({ type: ImageDto })
  async createImage(@Body() { prompt }: CreateImageDto) {
    return this.openAIService.createImage(prompt);
  }
}
