import { Provider } from '@nestjs/common';
import { GuildConfiguration } from './entities/GuildConfiguration';
import { Session } from './entities/Session';
import { User } from './entities/User';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { YoutubeChannel } from '../entities/YoutubeChannel';

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

export const entities = [GuildConfiguration, User, Session, YoutubeChannel];
