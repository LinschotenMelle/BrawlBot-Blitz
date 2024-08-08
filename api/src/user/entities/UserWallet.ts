import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { UserWalletCollectable } from './UserWalletCollectable';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'user_wallets' })
export class UserWallet {
  @ApiProperty()
  @PrimaryColumn()
  @AutoMap()
  userId: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  coins: number;

  @ApiProperty()
  @Column()
  @AutoMap()
  powerpoints: number;

  @ApiProperty()
  @ManyToMany(
    () => UserWalletCollectable,
    (collectable) => collectable.userWallets,
  )
  collectables: UserWalletCollectable[];
}
