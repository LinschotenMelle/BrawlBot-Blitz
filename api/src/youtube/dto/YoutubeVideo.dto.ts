import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class YoutubeVideoIdDto {
  @ApiProperty()
  videoId: string;
}

export class YoutubeHighThumbnailDto {
  @ApiProperty()
  url: string;
}

export class YoutubeThumbnailsDto {
  @ApiProperty()
  high: YoutubeHighThumbnailDto;
}

export class YoutubeSnippetDto {
  @ApiProperty()
  publishedAt: string;

  @ApiProperty()
  published: string;

  @ApiProperty()
  channelTitle: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  thumbnails: YoutubeThumbnailsDto;
}

export class YoutubeVideoDto {
  @ApiProperty()
  id: YoutubeVideoIdDto;

  @ApiProperty()
  snippet: YoutubeSnippetDto;
}
