import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY'),
    });
  }

  async createImage(prompt: string) {
    try {
      const image = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: 'a white siamese cat',
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      console.log(image.created);

      return image;
    } catch (error) {
      console.error(error);
    }
  }
}
