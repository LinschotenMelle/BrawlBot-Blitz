import { Injectable } from '@nestjs/common';
import { BrawlStarsUser } from '../utils/entities/BrawlStarsUser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrawlStarsMapDto } from './dto/Map.dto';
import axios, { AxiosInstance } from 'axios';
import { BrawlStarsPlayer, Club, BrawlStarsResponse } from './dto/Player.dto';
import { Brawler } from './dto/Brawler.dto';
import { ConfigService } from '@nestjs/config';

export interface IBrawlStarsService {
  saveProfile(user: BrawlStarsUser): Promise<BrawlStarsUser>;
  getRotation(): Promise<BrawlStarsMapDto[]>;
  getProfileByUserId(userId: string): Promise<BrawlStarsPlayer | undefined>;
  getProfileByTag(tag: string): Promise<BrawlStarsPlayer | undefined>;
  getBrawlers(): Promise<Brawler[]>;
  getClubs(countryCode: string): Promise<Club[]>;
  getPlayers(countryCode: string): Promise<BrawlStarsPlayer[]>;
}

@Injectable()
export class BrawlStarsService implements IBrawlStarsService {
  private axios: AxiosInstance;

  constructor(
    @InjectRepository(BrawlStarsUser)
    private readonly brawlStarsUserRepository: Repository<BrawlStarsUser>,
    private readonly configService: ConfigService,
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const response = await axios.post(
      'https://developer.brawlstars.com/api/login',
      {
        email: this.configService.getOrThrow('BRAWL_STARS_API_EMAIL'),
        password: this.configService.getOrThrow('BRAWL_STARS_API_PASSWORD'),
      },
    );

    this.axios = axios.create({
      baseURL: this.configService.getOrThrow('BRAWL_STARS_API_URL'),
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
        const response = await this.axios.get<BrawlStarsResponse>('/brawlers');
        return response?.data.items ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }

  async getClubs(countryCode: string): Promise<Club[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlStarsResponse>(
          `/rankings/${countryCode}/clubs`,
          {
            params: {
              limit: 25,
            },
          },
        );
        return response?.data.items ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }

  async getPlayers(countryCode: string): Promise<BrawlStarsPlayer[]> {
    let retries = 0;

    while (retries < 2) {
      try {
        const response = await this.axios.get<BrawlStarsResponse>(
          `/rankings/${countryCode}/players`,
          {
            params: {
              limit: 25,
            },
          },
        );
        return response?.data.items ?? [];
      } catch (e) {
        await this.initialize();
        retries++;
      }
    }

    return [];
  }
}
