import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './utils/typeorm/entities/Session';
import * as passport from 'passport';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const prefix = 'api';
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get<DataSource>('DataSource');

  const sessionRepository = dataSource.getRepository(Session);
  app.setGlobalPrefix(prefix);

  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.getOrThrow('COOKIE_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  const options = new DocumentBuilder()
    .addCookieAuth('connect.sid')
    .setTitle('BrawlBot Blitz API')
    .setDescription('Swagger Example API API description')
    .setVersion('1.1')
    .addApiKey({ type: 'apiKey', name: 'token', in: 'header' }, 'token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      authAction: {
        token: {
          name: 'token',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'token',
          },
        },
      },
    },
  });

  app.enableCors({
    origin: configService.getOrThrow('CORS_ORIGIN'),
    credentials: true,
  });
  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(configService.get('PORT') || 3001);
    console.log(`Server is running on: ${await app.getUrl()}`);
  } catch (e) {
    console.error(e);
  }
}
bootstrap();
