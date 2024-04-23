import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'youtube_channels' })
export class YoutubeChannel {
  @ApiProperty()
  @Column({ unique: true, name: 'guild_id', primary: true })
  guildId: string;

  @ApiProperty()
  @Column({ unique: true, name: 'api_key' })
  apiKey: string;

  @ApiProperty()
  @Column({ name: 'youtube_channel_id', unique: true })
  channelId: string;

  @ApiProperty()
  @Column({ name: 'guild_channel_id' })
  guildChannelId: string;

  @ApiProperty()
  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  @ApiProperty()
  @Column({ name: 'latest_video', nullable: true })
  latestVideoDateTime: Date;

  @ApiProperty()
  @Column({ name: 'active' })
  isActive: boolean;
}
