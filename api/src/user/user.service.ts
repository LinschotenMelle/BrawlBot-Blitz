import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetailsDto } from './dto/User.dto';
import { User } from './entities/User';
import { UpdateUserDetailsDto } from './dto/UpdateUserDetails.dto';
import { UserWallet } from './entities/UserWallet';

export interface IUserService {
  createUser(details: UserDetailsDto): Promise<User>;
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

  async createUser(details: UserDetailsDto): Promise<User> {
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
      where: { userId },
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
    return this.userWalletRepository.findOne({ where: { userId } });
  }
}
