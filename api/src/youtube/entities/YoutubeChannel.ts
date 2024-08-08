import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'youtube_channels' })
export class YoutubeChannel {
  @ApiProperty()
  @Column({ unique: true, name: 'guild_id', primary: true })
  @AutoMap()
  guildId: string;

  @ApiProperty()
  @Column({ unique: true, name: 'api_key' })
  @AutoMap()
  apiKey: string;

  @ApiProperty()
  @Column({ name: 'youtube_channel_id', unique: true })
  @AutoMap()
  channelId: string;

  @ApiProperty()
  @Column({ name: 'guild_channel_id' })
  @AutoMap()
  guildChannelId: string;

  @ApiProperty()
  @Column({ name: 'role_id', nullable: true })
  @AutoMap()
  roleId: string;

  @ApiProperty()
  @Column({ name: 'latest_video', nullable: true })
  latestVideoDateTime: Date;

  @ApiProperty()
  @Column({ name: 'active' })
  @AutoMap()
  isActive: boolean;
}
