import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';
import { UserWalletCollectable } from './UserWalletCollectable';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'user_wallets' })
export class UserWallet {
  @ApiProperty()
  @PrimaryColumn()
  @AutoMap()
  id: string;

  @ApiProperty()
  @Column()
  @AutoMap()
  coins: number;

  @ApiProperty()
  @Column()
  @AutoMap()
  powerpoints: number;

  @ApiProperty({ type: () => [UserWalletCollectable] })
  @JoinTable()
  @OneToMany(
    () => UserWalletCollectable,
    (collectable) => collectable.collectable,
    {
      cascade: true,
    },
  )
  collectables: UserWalletCollectable[];
}
