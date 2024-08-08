import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserWallet } from './UserWallet';

@Entity({ name: 'user_wallet_collectables' })
export class UserWalletCollectable {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  imageUrl: string;

  @ApiProperty()
  @ManyToMany(() => UserWallet, (userWallet) => userWallet.collectables)
  userWallets: UserWallet[];
}
