import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { YoutubeChannel } from '../youtube/entities/YoutubeChannel';
import { WelcomeMessage } from '../discord/entities/WelcomeMessage';
import { GuildMemberCount } from '../discord/entities/GuildMemberCount';
import { BrawlStarsUser } from '../brawl-stars/entities/BrawlStarsUser';
import { Session } from '../auth/entities/Session';
import { User } from '../user/entities/User';
import { UserWallet } from '../user/entities/UserWallet';
import { UserWalletCollectable } from '../user/entities/UserWalletCollectable';
import { Collectable } from '../user/entities/Collectable';

export const DataSourceProvider: Provider = {
  provide: 'DataSource',
  useFactory: async (configService: ConfigService): Promise<DataSource> => {
    const options: DataSourceOptions = {
      type: 'postgres',
      host: configService.getOrThrow('POSTGRES_HOST'),
      port: parseInt(configService.getOrThrow('POSTGRES_PORT')),
      username: configService.getOrThrow('POSTGRES_USER'),
      password: configService.getOrThrow('POSTGRES_PASSWORD'),
      database: configService.getOrThrow('POSTGRES_DB'),
      entities: entities,
      synchronize: true,
    };
    return new DataSource(options).initialize();
  },
  inject: [ConfigService],
};

export const entities = [
  User,
  Session,
  YoutubeChannel,
  WelcomeMessage,
  GuildMemberCount,
  BrawlStarsUser,
  UserWallet,
  Collectable,
  UserWalletCollectable,
];
