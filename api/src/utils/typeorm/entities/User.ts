import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, name: 'discord_id' })
  discordId: string;

  @ApiProperty()
  @Column({ name: 'access_token' })
  accessToken: string;

  @ApiProperty()
  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  discriminator: string;

  @ApiProperty()
  @Column({ nullable: true })
  avatar: string;
}
