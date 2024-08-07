import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetailsDto } from './dto/User.dto';
import { User } from './entities/User';
import { UpdateUserDetailsDto } from './dto/UpdateUserDetails.dto';

export interface IUserService {
  createUser(details: UserDetailsDto): Promise<User>;
  findUser(discordId: string): Promise<User | undefined>;
  updateUser(user: User, details: UpdateUserDetailsDto): Promise<User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
