import { Injectable } from '@nestjs/common';
import { BrawlStarsUser } from '../utils/entities/BrawlStarsUser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrawlStarsMapDto } from './dto/Map.dto';
import axios, { AxiosInstance } from 'axios';
import { BrawlStarsPlayer } from './dto/Player.dto';
import { Brawler, BrawlerResponse } from './dto/Brawler.dto';

export interface IBrawlStarsService {
  saveProfile(user: BrawlStarsUser): Promise<BrawlStarsUser>;
  getRotation(): Promise<BrawlStarsMapDto[]>;
  getProfileByUserId(userId: string): Promise<BrawlStarsPlayer | undefined>;
  getProfileByTag(tag: string): Promise<BrawlStarsPlayer | undefined>;
  getBrawlers(): Promise<Brawler[]>;
}

@Injectable()
export class BrawlStarsService implements IBrawlStarsService {
  private axios: AxiosInstance;

  constructor(
    @InjectRepository(BrawlStarsUser)
    private readonly brawlStarsUserRepository: Repository<BrawlStarsUser>,
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const response = await axios.post(
      'https://developer.brawlstars.com/api/login',
      {
        email: process.env.BRAWL_STARS_API_EMAIL,
        password: process.env.BRAWL_STARS_API_PASSWORD,
      },
    );

    this.axios = axios.create({
      baseURL: process.env.BRAWL_STARS_API_URL,
      headers: { Authorization: `Bearer ${response.data.temporaryAPIToken}` },
    });
  }

  async saveProfile(user: BrawlStarsUser): Promise<BrawlStarsUser> {
    await this.brawlStarsUserRepository.upsert(user, {
      conflictPaths: ['userId'],
    });

    return user;
  }

  async getProfileByUserId(
    userId: string,
  ): Promise<BrawlStarsPlayer | undefined> {
    const user = await this.brawlStarsUserRepository.findOne({
      where: { userId },
    });

    return this.getProfileByTag(user?.tag ?? '');
  }

  async getRotation(): Promise<BrawlStarsMapDto[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response =
          await this.axios.get<BrawlStarsMapDto[]>('/events/rotation');
        return response?.data ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }

  async getProfileByTag(tag: string): Promise<BrawlStarsPlayer | undefined> {
    let retries = 0;
    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlStarsPlayer>(
          `/players/${tag}`,
        );
        return response.data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          await this.initialize();
          retries++;
        } else {
          return undefined;
        }
      }
    }

    return undefined;
  }

  async getBrawlers(): Promise<Brawler[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlerResponse>('/brawlers');
        return response?.data.items ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }
}
