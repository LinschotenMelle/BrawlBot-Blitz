import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, name: 'discord_id' })
  @AutoMap()
  discordId: string;

  @ApiProperty()
  @Column({ name: 'access_token' })
  @AutoMap()
  accessToken: string;

  @ApiProperty()
  @Column({ name: 'refresh_token' })
  @AutoMap()
  refreshToken: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  username: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  discriminator: string;

  @ApiProperty()
  @Column({ nullable: true })
  @AutoMap()
  avatar: string;
}
