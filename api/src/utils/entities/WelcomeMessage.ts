import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'welcome_messages' })
export class WelcomeMessage {
  @ApiProperty()
  @Column({ unique: true, name: 'guild_id', primary: true })
  guildId: string;

  @ApiProperty()
  @Column({ name: 'channel_id' })
  channelId: string;
}
