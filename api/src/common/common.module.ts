import { AutomapperModule } from '@timonmasberg/automapper-nestjs';
import { Global, Module } from '@nestjs/common';
import { classes } from '@automapper/classes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { entities } from '../utils/dataSourceProvider';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DataSourceOptions> => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: parseInt(configService.get('POSTGRES_PORT')),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: entities,
          synchronize: true,
        };
      },
    }),
    PassportModule.register({ session: true }),
  ],
  exports: [AutomapperModule, TypeOrmModule, PassportModule],
})
export class CommonModule {}
