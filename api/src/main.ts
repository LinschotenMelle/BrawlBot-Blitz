import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './utils/typeorm/entities/Session';
import * as passport from 'passport';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const prefix = 'api';
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get<DataSource>('DataSource');

  const sessionRepository = dataSource.getRepository(Session);
  app.setGlobalPrefix(prefix);

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
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
    .setTitle('Nest-js Swagger Example API')
    .setDescription('Swagger Example API API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });
  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(process.env.PORT || 3001);
    console.log(`Server is running on: ${await app.getUrl()}`);
  } catch (e) {
    console.error(e);
  }
}
bootstrap();
