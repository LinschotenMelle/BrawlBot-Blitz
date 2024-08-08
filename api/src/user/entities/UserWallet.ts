import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { UserWalletCollectable } from './UserWalletCollectable';

@Entity({ name: 'user_wallets' })
export class UserWallet {
  @ApiProperty()
  @PrimaryColumn()
  userId: string;

  @ApiProperty()
  @Column()
  coins: number;

  @ApiProperty()
  @Column()
  powerpoints: number;

  @ApiProperty()
  @ManyToMany(
    () => UserWalletCollectable,
    (collectable) => collectable.userWallets,
  )
  collectables: UserWalletCollectable[];
}
