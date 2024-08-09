import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserWallet } from './UserWallet';
import { AutoMap } from '@automapper/classes';
import { Collectable } from './Collectable';

@Entity({ name: 'user_wallet_collectables' })
export class UserWalletCollectable {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ApiProperty({ type: () => UserWallet })
  @ManyToOne(() => UserWallet, (userWallet) => userWallet.collectables)
  userWallet: UserWallet;

  @ApiProperty({ type: () => Collectable })
  @ManyToOne(() => Collectable, (collectable) => collectable.collectables)
  collectable: UserWallet;
}
