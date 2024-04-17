import { Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../utils/typeorm/entities/User';
import { Repository } from 'typeorm';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(details: UserDetails): Promise<User> {
    const user = this.userRepository.create({ discordId: details.discordId });
    return this.userRepository.save(user);
  }

  async findUser(discordId: string) {
    return this.userRepository.findOne({ where: { discordId } });
  }
}
