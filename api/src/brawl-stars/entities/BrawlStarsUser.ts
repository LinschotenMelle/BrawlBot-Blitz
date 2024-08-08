import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'brawl_stars_users' })
export class BrawlStarsUser {
  @ApiProperty()
  @Column({ unique: true, name: 'user_id', primary: true })
  @AutoMap()
  userId: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  tag: string;
}
