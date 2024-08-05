import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty()
  prompt: string;
}

export class ImageDto {
  @ApiProperty()
  url: string;
}
