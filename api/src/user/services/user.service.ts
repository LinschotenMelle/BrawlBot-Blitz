import { Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../utils/typeorm/entities/User';
import { Repository } from 'typeorm';
import { UserDetails, UpdateUserDetails } from 'common/types/User';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(details: UserDetails): Promise<User> {
    const user = this.userRepository.create({ ...details });
    return this.userRepository.save(user);
  }

  async findUser(discordId: string) {
    return this.userRepository.findOne({ where: { discordId } });
  }

  async updateUser(user: User, details: UpdateUserDetails): Promise<User> {
    return this.userRepository.save({ ...user, ...details });
  }
}
