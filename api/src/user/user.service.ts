import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/User.dto';
import { User } from './entities/User';
import { UpdateUserDetailsDto } from './dto/UpdateUserDetails.dto';
import { UserWallet } from './entities/UserWallet';

export interface IUserService {
  createUser(details: UserDto): Promise<User>;
  findUser(discordId: string): Promise<User | undefined>;
  updateUser(user: User, details: UpdateUserDetailsDto): Promise<User>;
  updateWalletBalance(
    userId: string,
    coins: number,
    powerpoints: number,
  ): Promise<UserWallet>;
  getWalletBalance(userId: string): Promise<UserWallet>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserWallet)
    private readonly userWalletRepository: Repository<UserWallet>,
  ) {}

  async createUser(details: UserDto): Promise<User> {
    const user = this.userRepository.create({ ...details });
    return this.userRepository.save(user);
  }

  async findUser(discordId: string) {
    return this.userRepository.findOne({ where: { discordId } });
  }

  async updateUser(user: User, details: UpdateUserDetailsDto): Promise<User> {
    return this.userRepository.save({ ...user, ...details });
  }

  async updateWalletBalance(
    userId: string,
    coins: number,
    powerpoints: number,
  ): Promise<UserWallet> {
    var wallet = await this.userWalletRepository.findOne({
      where: { id: userId },
    });

    if (!wallet) {
      return this.userWalletRepository.save({
        userId,
        coins,
        powerpoints,
      });
    }

    wallet.coins += coins;
    wallet.powerpoints += powerpoints;

    await this.userWalletRepository.upsert(wallet, {
      conflictPaths: ['userId'],
      skipUpdateIfNoValuesChanged: true,
    });

    return wallet;
  }

  async getWalletBalance(userId: string): Promise<UserWallet> {
    const query = this.userWalletRepository
      .createQueryBuilder('user_wallet')
      .leftJoinAndSelect('user_wallet.collectables', 'collectables')
      .select([
        'user_wallet.id',
        'user_wallet.coins',
        'user_wallet.powerpoints',
        'collectables.id',
        'collectables.userWalletId',
        'collectables.collectableId',
      ])
      .where('user_wallet.id = :userId', { userId });

    console.log(query.getSql());

    return query.getOne();
  }
}
