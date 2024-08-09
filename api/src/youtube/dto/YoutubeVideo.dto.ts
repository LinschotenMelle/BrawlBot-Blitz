import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class YoutubeVideoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  publishedAt: string;

  @ApiProperty()
  channelTitle: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  videoTitle: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiPropertyOptional()
  description: string;
}
