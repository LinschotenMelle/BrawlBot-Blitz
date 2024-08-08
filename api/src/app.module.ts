import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceProvider, entities } from './utils/dataSourceProvider';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { DataSourceOptions } from 'typeorm';
import { DiscordModule } from './discord/discord.module';
import { YoutubeModule } from './youtube/youtube.module';
import { OpenaiModule } from './openai/openai.module';
import { BrawlStarsModule } from './brawl-stars/brawl-stars.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CommonModule,
    AuthModule,
    UserModule,
    DiscordModule,
    YoutubeModule,
    OpenaiModule,
    BrawlStarsModule,
  ],
  controllers: [],
  providers: [DataSourceProvider],
})
export class AppModule {}
