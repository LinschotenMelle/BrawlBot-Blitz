import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Collection,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserWalletCollectable } from './UserWalletCollectable';

@Entity({ name: 'collectables' })
export class Collectable {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  name: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  price: number;

  @ApiProperty()
  @Column()
  @AutoMap()
  imageUrl: string;

  @ApiProperty({ type: () => [UserWalletCollectable] })
  @OneToMany(
    () => UserWalletCollectable,
    (collectable) => collectable.collectable,
    {
      cascade: true,
    },
  )
  collectables: UserWalletCollectable[];
}
