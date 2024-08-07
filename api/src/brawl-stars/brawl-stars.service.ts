import { Injectable } from '@nestjs/common';
import { BrawlStarsUser } from './entities/BrawlStarsUser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrawlStarsMapDto } from './dto/Map.dto';
import axios, { AxiosInstance } from 'axios';
import { PlayerDto, ClubDto, BrawlStarsResponse } from './dto/Player.dto';
import { BrawlerDto } from './dto/Brawler.dto';
import { ConfigService } from '@nestjs/config';
import { UpsertBrawlStarsUserDto } from './dto/BrawlStarsUser.dto';

export interface IBrawlStarsService {
  saveProfile(user: UpsertBrawlStarsUserDto): Promise<BrawlStarsUser>;
  getRotation(): Promise<BrawlStarsMapDto[]>;
  getProfileByUserId(userId: string): Promise<PlayerDto | undefined>;
  getProfileByTag(tag: string): Promise<PlayerDto | undefined>;
  getBrawlers(): Promise<BrawlerDto[]>;
  getClubs(countryCode: string): Promise<ClubDto[]>;
  getPlayers(countryCode: string): Promise<PlayerDto[]>;
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

  async saveProfile(
    upsertBrawlStarsUserDto: UpsertBrawlStarsUserDto,
  ): Promise<BrawlStarsUser> {
    const user = await this.brawlStarsUserRepository.findOne({
      where: { userId: upsertBrawlStarsUserDto.userId },
    });
    await this.brawlStarsUserRepository.upsert(user, {
      conflictPaths: ['userId'],
    });

    return user;
  }

  async getProfileByUserId(userId: string): Promise<PlayerDto | undefined> {
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

  async getProfileByTag(tag: string): Promise<PlayerDto | undefined> {
    let retries = 0;
    while (retries < 2) {
      try {
        const response = await this.axios.get<PlayerDto>(`/players/${tag}`);
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

  async getBrawlers(): Promise<BrawlerDto[]> {
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

  async getClubs(countryCode: string): Promise<ClubDto[]> {
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

  async getPlayers(countryCode: string): Promise<PlayerDto[]> {
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
