import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'brawl_stars_user' })
export class BrawlStarsUser {
  @ApiProperty()
  @Column({ unique: true, name: 'user_id', primary: true })
  userId: string;

  @ApiProperty()
  @Column()
  tag: string;
}
