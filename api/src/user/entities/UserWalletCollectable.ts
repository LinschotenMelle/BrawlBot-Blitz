import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserWallet } from './UserWallet';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'user_wallet_collectables' })
export class UserWalletCollectable {
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

  @ApiProperty()
  @ManyToMany(() => UserWallet, (userWallet) => userWallet.collectables)
  userWallets: UserWallet[];
}
