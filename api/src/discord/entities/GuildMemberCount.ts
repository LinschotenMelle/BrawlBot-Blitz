import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'guild_member_counts' })
export class GuildMemberCount {
  @ApiProperty()
  @Column({ unique: true, name: 'guild_id', primary: true })
  guildId: string;

  @ApiProperty()
  @Column({ name: 'channel_id' })
  channelId: string;
}
