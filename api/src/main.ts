import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: new session.MemoryStore(),
    }),
  );
  try {
    await app.listen(process.env.PORT || 3001);
    console.log(`Server is running on: ${await app.getUrl()}`);
  } catch (e) {
    console.error(e);
  }
}
bootstrap();
