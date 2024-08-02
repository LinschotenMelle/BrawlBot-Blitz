import { Injectable } from '@nestjs/common';
import { BrawlStarsUser } from '../utils/entities/BrawlStarsUser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export interface IBrawlStarsService {
  saveProfile(user: BrawlStarsUser): Promise<BrawlStarsUser>;
  getProfile(userId: string): Promise<BrawlStarsUser | undefined>;
}

@Injectable()
export class BrawlStarsService implements IBrawlStarsService {
  constructor(
    @InjectRepository(BrawlStarsUser)
    private readonly brawlStarsUserRepository: Repository<BrawlStarsUser>,
  ) {}

  async saveProfile(user: BrawlStarsUser): Promise<BrawlStarsUser> {
    await this.brawlStarsUserRepository.upsert(user, {
      conflictPaths: ['userId'],
    });

    return user;
  }

  async getProfile(userId: string): Promise<BrawlStarsUser | undefined> {
    return this.brawlStarsUserRepository.findOne({ where: { userId } });
  }
}
