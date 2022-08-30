import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.use(cookieParser());
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://192.168.32.128:3000'],
      credentials: true,
    }),
  );
  // app.use(helmet());
  // app.use(helmet.hidePoweredBy());
  // app.use(helmet.contentSecurityPolicy());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
